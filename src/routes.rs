/* Imports */
use actix_web::{ get, post, HttpResponse, Responder, web, HttpRequest };
use std::{ fs::File, io::Write, sync::Mutex };
use uuid;
use serde_json::json;
use crate::appdata::{ AppData, Collection, Image };

/* Routes */
#[get("/")]
pub async fn index() -> impl Responder {
    HttpResponse::Ok().body("Backend works!")
}

/* Create: `title`(bytes) `date` `camera`(bytes) `place`(bytes) and body(bytes) */
#[post("/upload-single")]
pub async fn upload(req: HttpRequest, appdata: web::Data<Mutex<AppData>>, bytes: web::Bytes) -> impl Responder {
    /* Create file and write to it */
    let image_id = uuid::Uuid::new_v4().to_string();
    let mut file = File::create(format!("uploads/{}.JPG", image_id)).unwrap();
    file.write_all(&bytes).unwrap();

    /* Get headers */
    let (
        image_date,
        image_camera,
        image_place
    ) = match (
        req.headers().get("date"),
        req.headers().get("camera"),
        req.headers().get("place")
    ) {
        (Some(date), Some(camera), Some(place)) =>
            match (date.to_str(), camera.to_str(), place.to_str()) {
            (Ok(d_), Ok(c_), Ok(p_)) => (match d_.parse::<usize>() {
                Ok(e) => e,
                Err(_) => return payload_respond(400)
            }, c_.to_string(), p_.to_string()),
            _ => return payload_respond(400)
        },
        _ => return payload_respond(400)
    };

    /* If collection already exists */
    let uuid:String;
    if let Some(header) = req.headers().get("collection") {
        uuid = header.to_str().unwrap().to_string();

        /* Search for doc */
        for (id, doc) in appdata.lock().unwrap().collections.iter_mut() {
            if id == &uuid {
                doc.images()
                    .push(Image {
                        date    : image_date,
                        camera  : image_camera,
                        place   : image_place,
                        pathname: uuid
                    });
                appdata.lock().unwrap().save();

                /* Respond */
                return payload_respond(200);
            }
        };

        /* Respond */
        payload_respond(400)
    }else {
        /* Create uuid */
        uuid = uuid::Uuid::new_v4().to_string();
        let collection_title = match req.headers().get("title") {
            Some(title) => match title.to_str() {
                Ok(t_) => t_.to_string(),
                Err(_) => return HttpResponse::BadRequest().json(json!({}))
            },
            None => return HttpResponse::BadRequest().json(json!({}))
        };
        println!("{} {} {} {} UUID:{}", &image_camera, image_date, &image_place, image_id, uuid);

        /* Create collection */
        let collection = Collection {
            title: collection_title,
            images: vec![ Image {
                date: image_date, camera: image_camera, place: image_place,
                pathname: image_id
            }  ],
        };

        /* Insert collection */
        appdata.lock().unwrap().collections.insert(uuid, collection);
        appdata.lock().unwrap().save();

        /* Respond */
        payload_respond(200)
    }
}

/* Utils */
fn payload_respond(status:usize) -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "status": status
    }))
}
