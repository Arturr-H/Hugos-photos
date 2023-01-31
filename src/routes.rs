/* Imports */
use actix_web::{ get, post, HttpResponse, Responder, web };
use std::{ fs::File, io::Write };

/* Routes */
#[get("/")]
pub async fn index() -> impl Responder {
    HttpResponse::Ok().body("Backend works!")
}

#[post("/upload-single")]
pub async fn upload(bytes: web::Bytes) -> impl Responder {
    /* Create file and write to it */
    let mut file = File::create("uploads/image.JPG").unwrap();
    file.write_all(&bytes).unwrap();

    /* Respond */
    HttpResponse::Ok().body("Image uploaded successfully")
}
