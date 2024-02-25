mod api;
mod models;
mod repository;
mod responces;
mod middleware;

use actix_cors::Cors;

use actix_web::{web::Data, App, HttpServer};
use api::user_api;
use api::post_api;
use repository::mongodb_repo::MongoRepo;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = MongoRepo::init().await;
    let db_data = Data::new(db);

    let host = "0.0.0.0";
    let port = 80;

    println!("🚀 Server started successfully on http://{}:{}", host, port);

    HttpServer::new(move || {
        App::new()
            .app_data(db_data.clone())
            .wrap(
                Cors::permissive()
            )
            .configure(user_api::config)
            .configure(post_api::config)
    })
    .bind(format!("{}:{}", host, port))?
    .run()
    .await
}
