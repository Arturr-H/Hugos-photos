/* Imports */
use std::sync::Mutex;
use actix_web::{ App, HttpServer, web::{self, Data} };
use actix_cors::Cors;
use dotenv::dotenv;
use lazy_static::lazy_static;

/* Modules */
mod routes;
pub mod appdata;

/* Static */
lazy_static! {
    pub static ref SECRET:String = std::env::var("SECRET").unwrap();
}

/* Main */
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().unwrap();

    /* Preload secret for checking */
    let _ = &**SECRET;

    // appdata::AppData::new().save();
    let appdata = Data::new(Mutex::new(appdata::AppData::from_file()));
    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            /* Set maximum payload size to 32MiB */
            .app_data(web::PayloadConfig::new(1 << 25))
            .app_data(Data::clone(&appdata))

            /* Routes */
            .service(routes::upload)
            .service(routes::check_auth)
            .service(routes::index)
            .service(routes::collections)
            .service(routes::delete)
            .service(routes::debug)
            .route("/delete-collection/{collection:.*}", web::get().to(routes::delete_collection))

            /* Static files (/uploads) */
            .route("/uploads/{filename:.*}", web::get().to(routes::static_files))
            .route("/uploads-compressed/{filename:.*}", web::get().to(routes::static_files_compressed))
            .route("/get-collection/{collection:.*}", web::get().to(routes::get_collection))

            /* Add Cross origin resource sharing */
            .wrap(cors)
    })
    .workers(12)
    .bind(("0.0.0.0", 8082))?
    .run()
    .await
}
