
use actix_web::{web, HttpResponse};
use serde_json::json;

use crate::repository::mongodb_repo::MongoRepo;


pub async fn createPost(db: web::Data<MongoRepo> ) -> HttpResponse {

            HttpResponse::Ok().json(json!({"status": "fail", "message": "hola hola"}))

}





pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/posts") // Agrupamos los servicios bajo la ruta "/api"
            .service(web::resource("/").route(web::post().to(createPost)))
        
        
    );
}