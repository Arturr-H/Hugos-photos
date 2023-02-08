/* Imports */
use actix_web::{ get, post, HttpResponse, Responder, web, HttpRequest };
use std::{ fs::File, io::Write, sync::{Mutex, LockResult} };
use uuid;
use serde_json::json;
use crate::appdata::{ AppData, Collection, Image };
use regex;

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
    let date_regex = regex::Regex::new(r"\d{4}:\d{2}:\d{2} \d{2}:\d{2}").expect("This should compile unless versions are changed");

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
        uuid = match header.to_str() {
            Ok(e) => e,
            Err(_) => return payload_respond(4001)
        }.to_string();

        let mut success:bool = false;
        /* Search for doc */
        for (id, doc) in match appdata.lock() {
            Ok(e) => e,
            Err(_) => return payload_respond(4002)
        }.collections.iter_mut() {
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
            match appdata.lock() {
                Ok(e) => e,
                Err(_) => return payload_respond(4003)
            }.save();
        }else {
            /* Respond */
            return payload_respond(40004)
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
            },
            date: image_date.into()
        };

        /* I allow cloning here, because uuid is a relativly small string */
        match appdata.lock() {
            Ok(e) => e,
            Err(_) => return payload_respond(4005)
        }.collections.insert(uuid.clone(), collection);

        match appdata.lock() {
            Ok(e) => e,
            Err(_) => return payload_respond(4006)
        }.save();
    };

    /* Write to file - once all criteria meet */
    let mut file = match File::create(format!("uploads/{}.JPG", &image_id)) {
        Ok(e) => e,
        Err(_) => return payload_respond(4007)
    };
    let payload_index = match bytes
        .windows(4)
        .position(|w| matches!(w, b"\r\n\r\n"))
        .map(|ix| ix + 4) {
            Some(e) => e,
            None => return payload_respond(4008)
        };

    match file.write_all(&bytes[payload_index..]) {
        Ok(e) => e,
        Err(_) => return payload_respond(4009)
    };

    let img = match image::load_from_memory(&bytes[payload_index..]) {
        Ok(e) => e,
        Err(_) => return payload_respond(4010)
    };
    let width = img.width();
    let height = img.height();

    /* Resize */
    let img = img.resize(width / 6, height / 6, image::imageops::FilterType::Nearest);

    /* Write to ./uploads-compressed */
    match img.save(&format!("uploads-compressed/{}.JPG", &image_id)) {
        Ok(e) => e,
        Err(_) => return payload_respond(4011)
    };

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
        &*match appdata.lock() {
            LockResult::Ok(e) => e,
            LockResult::Err(_) => return payload_respond(4012)
        }
    )
}

/* *CLEAR* all documents */
#[get("/delete-all")]
pub async fn delete(appdata: web::Data<Mutex<AppData>>) -> impl Responder {
    *match appdata.lock() {
        LockResult::Ok(e) => e,
        LockResult::Err(_) => return payload_respond(4013)
    } = AppData::new();
    match AppData::new().save() {
        Some(_) => (),
        None => return payload_respond(4014),
    };

    payload_respond(200)
}

/* Static file */
pub async fn static_files(req: HttpRequest) -> impl Responder {
    let path = req.match_info().get("filename").unwrap_or("warning");
    HttpResponse::Ok().content_type("image/jpg").body(
        match std::fs::read(
            format!("./uploads/{}.JPG", path)
        ) {
            Ok(e) => e,
            Err(_) => return payload_respond(4014),
        }
    )
}
pub async fn static_files_compressed(req: HttpRequest) -> impl Responder {
    let path = req.match_info().get("filename").unwrap_or("warning");
    HttpResponse::Ok().content_type("image/jpg").body(
        match std::fs::read(
            format!("./uploads-compressed/{}.JPG", path)
        ) {
            Ok(e) => e,
            Err(_) => return payload_respond(4014),
        }
    )
}

pub async fn get_collection(req: HttpRequest, appdata: web::Data<Mutex<AppData>>) -> impl Responder {
    let path = req.match_info().get("collection").unwrap_or("");
    let coll = &match appdata.lock() {
        LockResult::Ok(e) => e,
        LockResult::Err(_) => return payload_respond(4012)
    }.collections;
    HttpResponse::Ok().json(
        &coll.get(path)
    )
}

/* Utils */
fn payload_respond(status:usize) -> HttpResponse {
    dbg!(status);
    HttpResponse::Ok().json(json!({
        "status": status
    }))
}

