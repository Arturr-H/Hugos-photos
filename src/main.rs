/* Imports */
use actix_web::{ App, HttpServer, web };

/* Modules */
mod routes;
pub mod appdata;

/* Main */
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let appdata = appdata::AppData::new();
    appdata.save();
    
    HttpServer::new(|| {
        App::new()
            /* Set maximum payload size to 32MiB */
            .app_data(web::PayloadConfig::new(1 << 25))
            .app_data(appdata::AppData::from_file())

            /* Routes */
            .service(routes::upload)
            .service(routes::index)
    })
    .workers(12)
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
