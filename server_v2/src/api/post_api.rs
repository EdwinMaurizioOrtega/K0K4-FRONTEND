use std::{env, fs};
use std::collections::HashMap;
use std::fs::{File, read};
use std::io::Write;
use std::path::Path;
use actix_multipart::Multipart;
use actix_web::{web, HttpResponse, get, Responder, post, patch, put, delete, HttpRequest, HttpMessage};
use actix_web::web::Data;
use argon2::Error;
use chrono::{Datelike, Utc};
use dotenv::dotenv;
use futures::StreamExt;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use mongodb::bson::{DateTime, doc};
use mongodb::bson::oid::ObjectId;
use rand::{Rng, thread_rng};
use rand::distributions::Alphanumeric;
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::middleware::auth_middleware;
use crate::middleware::auth_middleware::{JwtMiddleware};

use crate::repository::mongodb_repo::MongoRepo;
use crate::models::post_model::{GetPostsInCarousel, ImageFile, Post, QueryParams};
use crate::models::user_model::{TokenClaims, UserIdentifier};

#[get("/in_carousel")]
async fn get_posts_in_carousel(query_params: web::Query<GetPostsInCarousel>, db: Data<MongoRepo>) -> HttpResponse {
    println!("category: {}", query_params.category);
    println!("city: {}", query_params.city);

    let category = query_params.category.to_owned();
    let city = query_params.city.to_owned();

    if category.is_empty() {
        return HttpResponse::BadRequest().body("invalid ID");
    }

    let user_detail = db.get_posts_in_carousel(&category, &city).await;

    match user_detail {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}

#[get("/in_carousel_by_city")]
async fn get_posts_in_carousel_by_city(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    HttpResponse::Ok().json("hola")
}

#[get("/creator")]
async fn get_posts_by_creator(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    HttpResponse::Ok().json("hola")
}

#[get("/city")]
async fn get_posts_by_city(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    HttpResponse::Ok().json("hola")
}

#[get("/id_creator")]
async fn get_posts_by_id_creator(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    let id = query_params.creator.to_owned();
    if id.is_empty() {
        return HttpResponse::BadRequest().body("invalid ID");
    }

    let user_detail = db.get_all_posts_by_creator(&id).await;

    match user_detail {
        Ok(user) => {
            println!("{:?}", json!(user));

            HttpResponse::Ok().json(user)
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/search")]
async fn get_posts_by_search(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    HttpResponse::Ok().json("hola")
}

#[get("/")]
async fn get_posts(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    HttpResponse::Ok().json("hola")
}

#[get("/:id")]
async fn get_post(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    HttpResponse::Ok().json("hola")
}

#[post("/")]
pub async fn create_post(
    mut payload: Multipart,
    db: web::Data<MongoRepo>,
    req: HttpRequest, // Agregar HttpRequest como argumento
    _: JwtMiddleware, // Agregar JwtMiddleware como argumento
) -> Result<HttpResponse, actix_web::Error> {

    // Obtener el user_id y user_name del middleware
    let user_identifier = req.extensions().get::<UserIdentifier>().unwrap().to_owned();

    println!("user_id: {:?}", user_identifier.user_id);
    println!("user_name: {:?}", user_identifier.user_name);

    //Lo demas del codigo

    dotenv().ok(); // Cargar las variables de entorno desde el archivo .env

    let mut form = Post {
        id: None,
        category: String::new(),
        title: String::new(),
        message: String::new(),
        name: String::new(),
        creator: String::new(),
        cellphone: String::new(),
        city: String::new(),
        tags: Vec::new(),
        selected_file: Vec::new(),
        likes: Vec::new(),
        in_carousel: false,
        comments: Vec::new(),
        top_banner_uploaded_in: None,
        created_at: None,
    };

    form.created_at = Some(DateTime::now());

    let current_time = Utc::now();
    let year = current_time.year().to_string();
    let month = format!("{:02}", current_time.month());

    let uploads_path = match env::var("UPLOADS_PATH") {
        Ok(v) => v.to_string(),
        Err(_) => format!("Error loading env variable"),
    };

    println!("Ruta: {:?}", uploads_path);

    let base_dir = Path::new(&uploads_path);

    // Crea la estructura de carpetas si no existen
    let year_dir = base_dir.join(&year);
    let month_dir = year_dir.join(&month);
    fs::create_dir_all(&month_dir).unwrap();

    // Validamos la ruta
    let url = match env::var("HOST") {
        Ok(v) => v.to_string(),
        Err(_) => format!("Error loading env variable"),
    };

    while let Some(item) = payload.next().await {
        let mut field = item?;
        let content_type = field.content_disposition();

        if let Some(name) = content_type.get_name() {
            match name {
                "title" => {
                    let bytes = field.next().await.unwrap().unwrap(); // Obtiene Bytes
                    form.title = String::from_utf8_lossy(&bytes).to_string(); // Convierte a String
                }
                "category" => {
                    let bytes = field.next().await.unwrap().unwrap();
                    form.category = String::from_utf8_lossy(&bytes).to_string();
                }
                "message" => {
                    let bytes = field.next().await.unwrap().unwrap();
                    form.message = String::from_utf8_lossy(&bytes).to_string();
                }
                "cellphone" => {
                    let bytes = field.next().await.unwrap().unwrap();
                    form.cellphone = String::from_utf8_lossy(&bytes).to_string();
                }
                "city" => {
                    let bytes = field.next().await.unwrap().unwrap();
                    form.city = String::from_utf8_lossy(&bytes).to_string();
                }
                "selectedFile" => {
                    let filename = content_type.get_filename().unwrap();

                    // Obtener la extensión del archivo
                    let file_ext = Path::new(filename)
                        .extension()
                        .and_then(|ext| ext.to_str())
                        .unwrap_or("");

                    // Generar un nombre de archivo aleatorio
                    let rand_filename: String = thread_rng()
                        .sample_iter(&Alphanumeric)
                        .take(20) // Cambia este número a la longitud deseada del nombre
                        .map(char::from)
                        .collect();

                    // Concatenar el nombre de archivo aleatorio con la extensión
                    let full_filename = if file_ext.is_empty() {
                        rand_filename
                    } else {
                        format!("{}.{}", rand_filename, file_ext)
                    };


                    //No mover de aqui -_-
                    let selected_file = ImageFile {
                        id: None,
                        file_name: full_filename.to_string(),
                        file_type: file_ext.to_string(),
                        file_url: format!("{}/posts/uploads/{}/{}/{}", url, year, month, full_filename),
                    };

                    let file_path = month_dir.join(full_filename);

                    let mut file = File::create(file_path).unwrap();
                    while let Some(chunk) = field.next().await {
                        let data = chunk.unwrap();
                        file.write_all(&data).unwrap();
                    }
                    //Aquí
                    form.selected_file.push(selected_file);
                }
                _ => (),
            }
        }
    }

    // // Imprime los valores de los campos por consola
    println!("Title: {}", form.title);

    // Crear un documento con los datos
    let mut new_document = Post {
        id: None,
        title: form.title,
        category: form.category,
        message: form.message,
        name: user_identifier.user_name,
        creator: user_identifier.user_id,
        cellphone: form.cellphone,
        city: form.city,
        tags: vec![],
        selected_file: form.selected_file,
        likes: vec![],
        created_at: None,
        in_carousel: false,
        comments: vec![],
        top_banner_uploaded_in: None,
    };

    // Asignar la fecha y hora actual antes de guardar el documento
    new_document.created_at = Some(DateTime::now());

    // Convertir el documento a BSON
    let new_document_bson = new_document;
    // Imprimir el contenido del documento BSON en la consola
    println!("Contenido del documento BSON: {:?}", new_document_bson);

    let pre_files = db.create_post(new_document_bson).await;

    match pre_files {
        Ok(data) => {
            let id_insertado = data.inserted_id.as_object_id().unwrap().to_hex();

            println!("Contenido de data: {:?}", id_insertado);

            //Buscamos el usuario insertado
            let post_detail = db.get_post_by_id(&id_insertado).await;

            match post_detail {
                Ok(post) => {
                    let user_response = json!({"status": "success", "result": post});

                    Ok::<HttpResponse, actix_web::Error>(HttpResponse::Ok().json(user_response)).expect("TODO: panic message");
                }

                Err(e) => {
                    Ok::<HttpResponse, actix_web::Error>(HttpResponse::InternalServerError()
                        .json(serde_json::json!({"status": "error","message": format!("{:?}", e)}))).expect("TODO: panic message");
                }
            }
            // HttpResponse::Ok().json(data)
        }
        Err(err) => {
            // HttpResponse::InternalServerError().body(err.to_string())

            println!("Error Error");

            Ok::<HttpResponse, actix_web::Error>(HttpResponse::InternalServerError()
                .json(serde_json::json!({"status": "error","message": format!("{:?}", err)}))).expect("TODO: panic message");
        }
    }

    Ok(HttpResponse::Ok().json("Archivos recibidos y guardados correctamente"))

}


#[get("/uploads/{year}/{month}/{filename:.+}")]
async fn serve_file(path: web::Path<(String, String, String)>) -> Result<HttpResponse, actix_web::Error> {
    let (year, month, filename) = path.into_inner();

    let uploads_path = env::var("UPLOADS_PATH").unwrap();
    let base_path = Path::new(&uploads_path);

    let folder_path = base_path.join(&year).join(&month);
    let file_path = folder_path.join(&filename);

    if let Ok(file_data) = read(file_path.clone()) {
        let content_type = match file_path.extension() {
            Some(ext) if ext == "jpg" => "image/jpeg",
            Some(ext) if ext == "png" => "image/png",
            Some(ext) if ext == "pdf" => "application/pdf",
            _ => "application/octet-stream", // Tipo genérico si no se reconoce la extensión
        };

        Ok(HttpResponse::Ok()
            .content_type(content_type)
            .body(file_data))
    } else {
        Ok(HttpResponse::NotFound().body("Archivo no encontrado"))
    }
}


#[patch("/:id")]
async fn update_post(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    HttpResponse::Ok().json("hola")
}


#[put("/:id")]
async fn top_post(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    HttpResponse::Ok().json("hola")
}


#[delete("/:id")]
async fn delete_post(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    HttpResponse::Ok().json("hola")
}

#[patch("/:id/likePost")]
async fn like_post(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    HttpResponse::Ok().json("hola")
}


#[post("/:id/commentPost")]
async fn comment_post(query_params: web::Query<QueryParams>, db: Data<MongoRepo>) -> HttpResponse {
    println!("creator: {}", query_params.creator);

    HttpResponse::Ok().json("hola")
}

pub fn config(cfg: &mut web::ServiceConfig) {
    let scope = web::scope("/posts")
        // Crear un post
        //Listar por el id del creador del los post
        .service(serve_file)

        .service(get_posts_in_carousel)
        .service(get_posts_in_carousel_by_city)
        .service(get_posts_by_creator)
        .service(get_posts_by_city)
        .service(get_posts_by_id_creator)
        .service(get_posts_by_search)
        .service(get_posts)
        .service(get_post)
        .service(create_post)
        .service(update_post)
        .service(top_post)
        .service(delete_post)
        .service(like_post)
        .service(comment_post);

    cfg.service(scope);
}


#[derive(Debug, Deserialize, Serialize)]
struct TokenData {
    sub: SubClaims,
    iat: i64,
    exp: i64,
}

#[derive(Debug, Deserialize, Serialize)]
struct SubClaims {
    #[serde(rename = "_id")]
    id: Id,
    username: String,
    email: String,
    password: String,
    created_at: HashMap<String, DateLong>,
}

#[derive(Debug, Deserialize, Serialize)]
struct Id {
    #[serde(rename = "$oid")]
    oid: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct DateLong {
    #[serde(rename = "$numberLong")]
    number_long: String,
}