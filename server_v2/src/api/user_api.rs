use crate::{
    models::user_model::User,
    repository::mongodb_repo::MongoRepo,
    responces::user_respo::FilteredUser,
};
use mongodb::bson::DateTime;
use serde::{Deserialize, Serialize};
use jsonwebtoken::{encode, Algorithm, EncodingKey, Header, TokenData};
use std::time::{SystemTime, UNIX_EPOCH};

use serde_json::json;

use chrono::{prelude::*, Duration};


use actix_web::{
    delete, get, post, put,
    web::{Data, Json, Path},
    HttpResponse,
    cookie,
};
use mongodb::bson::oid::ObjectId;

use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use crate::models::user_model::LoginUserSchema;


#[derive(Serialize)]
struct MyObjMessage {
    message: String,
}

#[post("/user")]
pub async fn create_user(db: Data<MongoRepo>, new_user: Json<User>) -> HttpResponse {
    let mut data = User {
        id: None,
        name: new_user.name.to_owned(),
        email: new_user.email.to_owned(),
        password: new_user.password.to_owned(),
        photo: new_user.photo.to_owned(),
        role: new_user.role.to_owned(),
        verified: new_user.verified,
        created_at: None,
        updated_at: None,

    };

    // Asignar la fecha y hora actual antes de guardar el documento
    data.created_at = Some(DateTime::now());
    data.updated_at = Some(DateTime::now());

    let user_id = db.create_user(data).await;

    match user_id {
        Ok(user) => {
            println!("Contenido de data: {:?}", user.inserted_id.as_object_id().unwrap());
            let id_insertado = user.inserted_id.as_object_id().unwrap().to_hex();
            println!("Contenido de data: {:?}", id_insertado);

            let user_detail = db.get_user(&id_insertado).await;

            match user_detail {
                Ok(user_d) => {
                    let user_response = serde_json::json!({"status": "success","data": serde_json::json!({
                        "user": user_d })});
                    return HttpResponse::Ok().json(user_response);
                }

                Err(e) => {
                    return HttpResponse::InternalServerError()
                        .json(serde_json::json!({"status": "error","message": format!("{:?}", e)}));
                }
            }

        }
        Err(e) => {
            return HttpResponse::InternalServerError()
                .json(serde_json::json!({"status": "error","message": format!("{:?}", e)}));
        }
    }


    //
    // let salt = SaltString::generate(&mut OsRng);
    // let hashed_password = Argon2::default()
    //     .hash_password(new_user.password.as_bytes(), &salt)
    //     .expect("Error while hashing password")
    //     .to_string();
    //
    //
    //
    // let mut data = User {
    //     id: None,
    //     name: new_user.name.to_owned(),
    //     email: new_user.email.to_owned(),
    //     password: new_user.password.to_owned(),
    //     created_at: None,
    // };
    //
    // // Asignar la fecha y hora actual antes de guardar el documento
    // data.created_at = Some(DateTime::now());
    //
    // let user_detail = db.create_user(data).await;
    //
    // // match user_detail {
    // //     Ok(user) => HttpResponse::Ok().json(user),
    // //     Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    // // }
    //
    // match user_detail {
    //     Ok(user) => {
    //         let user_response = serde_json::json!({"status": "success","data": serde_json::json!({
    //             "user": filter_user_record(&user)
    //         })});
    //
    //         return HttpResponse::Ok().json(user_response);
    //     }
    //     Err(e) => {
    //         return HttpResponse::InternalServerError()
    //             .json(serde_json::json!({"status": "error","message": format!("{:?}", e)}));
    //     }
    // }
}

#[post("/user/signup")]
pub async fn signup(db: Data<MongoRepo>, new_user: Json<LoginUserSchema>) -> HttpResponse {
    println!("Contenido de data: {:?}", new_user);

    if new_user.email.is_empty() {
        return HttpResponse::BadRequest().body("invalid Email");
    }


    let query_result =  db.get_user_by_email(&new_user.email).await;

    match query_result {
        Some(user) => {


            println!("Contenido de data: {:?}", user);

            // Compare the passwords directly
            let is_valid = new_user.password == user.password;

            if !is_valid {
                return HttpResponse::BadRequest()
                    .json(json!({"status": "fail", "message": "Invalid email or password"}));
            }

            // Generate JWT token and set it in the cookie
            let now = Utc::now();
            let iat = now.timestamp() as usize;
            let exp = (now + Duration::minutes(60)).timestamp() as usize;

            let claims: TokenClaims = TokenClaims {
                sub: user,
                exp,
                iat,
            };

            let token = encode(
                &Header::default(), &claims,
                &EncodingKey::from_secret( "hols".as_ref()),
            )
                .unwrap();

            let cookie_a = cookie::Cookie::build("token", token.to_owned())
                .path("/")
                .max_age(cookie::time::Duration::new(60 * 60, 0))
                .http_only(true)
                .finish();

            HttpResponse::Ok()
                .cookie(cookie_a)
                .json(json!({"status": "success", "token": token}))
        },
        None => {
            HttpResponse::NotFound().json(json!({"status": "fail", "message": "User not found"}))
        }
    }
}

#[get("/user/{id}")]
pub async fn get_user(db: Data<MongoRepo>, path: Path<String>) -> HttpResponse {
    let id = path.into_inner();
    if id.is_empty() {
        return HttpResponse::BadRequest().body("invalid ID");
    }
    let user_detail = db.get_user(&id).await;

    match user_detail {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

// #[put("/user/{id}")]
// pub async fn update_user(
//     db: Data<MongoRepo>,
//     path: Path<String>,
//     new_user: Json<User>,
// ) -> HttpResponse {
//     let id = path.into_inner();
//     if id.is_empty() {
//         return HttpResponse::BadRequest().body("invalid ID");
//     };
//     let data = User {
//         id: Some(ObjectId::parse_str(&id).unwrap()),
//         name: new_user.name.to_owned(),
//         email: new_user.email.to_owned(),
//         password: new_user.password.to_owned(),
//         created_at: Some(DateTime::now()),
//     };
//
//     let update_result = db.update_user(&id, data).await;
//
//     match update_result {
//         Ok(update) => {
//             if update.matched_count == 1 {
//                 let updated_user_info = db.get_user(&id).await;
//
//                 return match updated_user_info {
//                     Ok(user) => HttpResponse::Ok().json(user),
//                     Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
//                 };
//             } else {
//                 return HttpResponse::NotFound().body("No user found with specified ID");
//             }
//         }
//         Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
//     }
// }

#[delete("/user/{id}")]
pub async fn delete_user(db: Data<MongoRepo>, path: Path<String>) -> HttpResponse {
    let id = path.into_inner();
    if id.is_empty() {
        return HttpResponse::BadRequest().body("invalid ID");
    };
    let result = db.delete_user(&id).await;

    match result {
        Ok(res) => {
            if res.deleted_count == 1 {
                return HttpResponse::Ok().json("User successfully deleted!");
            } else {
                return HttpResponse::NotFound().json("User with specified ID not found!");
            }
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/users")]
pub async fn get_all_users(db: Data<MongoRepo>) -> HttpResponse {
    let users = db.get_all_users().await;
    println!("hola hola");
    match users {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}


#[derive(Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub sub: User,
    pub iat: usize,
    pub exp: usize,
}