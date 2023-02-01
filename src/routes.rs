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
        let mut success:bool = false;
        /* Search for doc */
        for (id, doc) in appdata.lock().unwrap().collections.iter_mut() {
            if id == &uuid {
                doc.images()
                    .push(Image {
                        date    : image_date,
                        camera  : image_camera.into(),
                        place   : image_place.into(),
                        pathname: image_id.clone()
                    });
                success = true;
                break;
            }
        };

        if success {
            appdata.lock().unwrap().save();
        }else {
            /* Respond */
            return payload_respond(400)
        }
    }else {
        /* Create uuid */
        uuid = uuid::Uuid::new_v4().to_string();
        let collection_title = match req.headers().get("title") {
            Some(title) => match title.to_str() {
                Ok(t_) => t_.to_string(),
                Err(_) => return payload_respond(400)
            },
            None => return payload_respond(400)
        };

        /* Create collection */
        let collection = Collection {
            title: collection_title.into(),
            images: vec![],
            cover_image: Image {
                date: image_date, camera: image_camera.into(), place: image_place.into(),
                pathname: image_id.clone()
            }  
        };

        /* I allow cloning here, because uuid is a relativly small string */
        appdata.lock().unwrap().collections.insert(uuid.clone(), collection);
        appdata.lock().unwrap().save();
    };

    /* Write to file - once all criteria meet */
    let mut file = File::create(format!("uploads/{}.JPG", &image_id)).unwrap();
    let payload_index = bytes
        .windows(4)
        .position(|w| matches!(w, b"\r\n\r\n"))
        .map(|ix| ix + 4).unwrap();

    file.write_all(&bytes[payload_index..]).unwrap();

    /* Respond */
    HttpResponse::Ok().json(json!({
        "status": 200,
        "message": "Created Collection!",
        "collection-id": &uuid
    }))
}

/* Return all documents */
#[get("/collections")]
pub async fn collections(appdata: web::Data<Mutex<AppData>>) -> impl Responder {
    HttpResponse::Ok().json(
        &*appdata
            .lock()
            .unwrap()
    )
}

/* *CLEAR* all documents */
#[get("/delete-all")]
pub async fn delete(appdata: web::Data<Mutex<AppData>>) -> impl Responder {
    *appdata.lock().unwrap() = AppData::new();
    AppData::new().save();

    "Deleted!"
}

/* Utils */
fn payload_respond(status:usize) -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "status": status
    }))
}
