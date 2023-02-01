/* Imports */
use std::sync::Mutex;
use actix_web::{ App, HttpServer, web::{self, Data} };
use actix_cors::Cors;

/* Modules */
mod routes;
pub mod appdata;

/* Main */
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let appdata = Data::new(Mutex::new(appdata::AppData::from_file()));
    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            /* Set maximum payload size to 32MiB */
            .app_data(web::PayloadConfig::new(1 << 25))
            .app_data(Data::clone(&appdata))

            /* Routes */
            .service(routes::upload)
            .service(routes::index)
            .service(routes::collections)
            .service(routes::delete)

            /* Static files (/uploads) */
            .route("/uploads/{filename:.*}", web::get().to(routes::static_files))

            /* Add Cross origin resource sharing */
            .wrap(cors)
    })
    .workers(12)
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
