/* Imports */
use actix_web::{ get, post, HttpResponse, Responder, web, HttpRequest };
use std::{ fs::File, io::Write, sync::Mutex };
use magick_rust::{ MagickWand, magick_wand_genesis };
use std::sync::Once;
use uuid;
use serde_json::json;
use crate::appdata::{ AppData, Collection, Image };
use regex;

/* Magick rust */
static START: Once = Once::new();

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
    let date_regex = regex::Regex::new(r"\d{4}:\d{2}:\d{2} \d{2}:\d{2}").unwrap();

    /* Get headers */
    let (
        image_date,
        image_camera,
        image_place,
        image_title
    ) = match (
        req.headers().get("date_"),
        req.headers().get("camera_"),
        req.headers().get("place_"),
        req.headers().get("title")
    ) {
        (Some(date), Some(camera), Some(place), Some(title)) => (date.to_str().unwrap_or("Invalid date!"), camera.as_bytes(), place.as_bytes(), title.as_bytes()),
        _ => return payload_respond(400)
    };

    let date:String;
    if let Some(cap) = date_regex.captures(&String::from_utf8_lossy(&bytes[0..1000])) {
        date = cap[0]
            .to_string()
            .replacen(":", "/", 2);
    }else {
        date = "Unknown date".into()
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
                        title   : image_title.into(),
                        date,
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
        let collection = Collection {
            title: collection_title.as_bytes().to_vec(),
            images: vec![],
            cover_image: Image {
                title: vec![],
                date: image_date.into(), camera: image_camera.into(), place: image_place.into(),
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
    
    START.call_once(|| {
        magick_wand_genesis();
    });
    let wand = MagickWand::new();
    wand.read_image_blob(&bytes[payload_index..]).unwrap();
    let width = wand.get_image_width();
    let height = wand.get_image_height();

    /* Resize */
    wand.resize_image(width / 4, height / 4, 0);

    /* Write to ./uploads-compressed */
    wand.write_image(&format!("uploads-compressed/{}.JPG", &image_id)).unwrap();

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
pub async fn static_files_compressed(req: HttpRequest) -> impl Responder {
    let path = req.match_info().get("filename").unwrap_or("warning");
    HttpResponse::Ok().content_type("image/jpg").body(
        std::fs::read(
            format!("./uploads-compressed/{}.JPG", path)
        )
        .unwrap()
    )
}

pub async fn get_collection(req: HttpRequest, appdata: web::Data<Mutex<AppData>>) -> impl Responder {
    let path = req.match_info().get("collection").unwrap_or("");
    let coll = &appdata.lock().unwrap().collections;
    HttpResponse::Ok().json(
        &coll.get(path)
    )
}

/* Utils */
fn payload_respond(status:usize) -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "status": status
    }))
}

