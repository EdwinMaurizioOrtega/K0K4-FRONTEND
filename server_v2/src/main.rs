mod api;
mod models;
mod repository;
mod responces;
use actix_cors::Cors;

use actix_web::{web::Data, App, HttpServer};
use api::user_api;
use api::post_api;
use repository::mongodb_repo::MongoRepo;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = MongoRepo::init().await;
    let db_data = Data::new(db);

    let port = 8080;

    println!("🚀 Server started successfully at http://0.0.0.0:{}", port);

    HttpServer::new(move || {
        App::new()
            .app_data(db_data.clone())
            .wrap(
                Cors::permissive()
            )
            .configure(user_api::config)
            .configure(post_api::config)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
