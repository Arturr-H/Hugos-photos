/* Imports */
use std::sync::Mutex;
use actix_web::{ App, HttpServer, web::{self, Data} };

/* Modules */
mod routes;
pub mod appdata;

/* Main */
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let appdata = Data::new(Mutex::new(appdata::AppData::from_file()));
    HttpServer::new(move || {

        App::new()
            /* Set maximum payload size to 32MiB */
            .app_data(web::PayloadConfig::new(1 << 25))
            .app_data(Data::clone(&appdata))

            /* Routes */
            .service(routes::upload)
            .service(routes::index)
            .service(routes::collections)
            .service(routes::delete)
    })
    .workers(12)
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
