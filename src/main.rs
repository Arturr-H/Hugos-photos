/* Imports */
use actix_web::{ App, HttpServer, web };

/* Modules */
mod routes;
mod appdata;

/* Main */
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            /* Set maximum payload size to 32MiB */
            .app_data(web::PayloadConfig::new(1 << 25))

            /* Routes */
            .service(routes::upload)
            .service(routes::index)
    })
    .workers(12)
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}