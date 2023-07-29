mod api;
mod models;
mod repository;
mod responces;
use actix_cors::Cors;

use actix_web::{web::Data, App, HttpServer};
use api::user_api::{create_user};
use repository::mongodb_repo::MongoRepo;
use crate::api::user_api::signup;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = MongoRepo::init().await;
    let db_data = Data::new(db);

    println!("🚀 Server started successfully");

    HttpServer::new(move || {
        App::new()
            .app_data(db_data.clone())
            .wrap(
                Cors::permissive()
            )
            .service(create_user)
            .service(signup)
            // .service(get_user)
            // .service(update_user)
            // .service(delete_user)
            // .service(get_all_users)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
