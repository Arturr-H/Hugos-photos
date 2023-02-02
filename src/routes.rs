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

/* Create: `title`(bytes) `date_` `camera_`(bytes) `place_`(bytes) and body(bytes) */
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
        req.headers().get("date_"),
        req.headers().get("camera_"),
        req.headers().get("place_")
    ) {
        (Some(date), Some(camera), Some(place)) => (date.to_str().unwrap().parse::<usize>().unwrap(), camera.as_bytes(), place.as_bytes()),
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
            Some(title) => String::from_utf8_lossy(title.as_bytes()),
            None => return payload_respond(400)
        };

        /* Create collection */
        dbg!(&collection_title);
        let collection = Collection {
            title: collection_title.as_bytes().to_vec(),
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

/* Static file */
pub async fn static_files(req: HttpRequest) -> impl Responder {
    let path = req.match_info().get("filename").unwrap_or("warning");
    HttpResponse::Ok().content_type("image/jpg").body(
        std::fs::read(
            format!("./uploads/{}.JPG", path)
        )
        .unwrap()
    )
}

pub async fn get_collection(req: HttpRequest, appdata: web::Data<Mutex<AppData>>) -> impl Responder {
    let path = req.match_info().get("collection").unwrap_or("");
    HttpResponse::Ok().json(
        appdata
            .lock()
            .unwrap()
            .collections
            .get(path)
            .unwrap()
    )
}

/* Utils */
fn payload_respond(status:usize) -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "status": status
    }))
}

