use mongodb::bson::DateTime;
use mongodb::bson::oid::ObjectId;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub username: String,
    pub email: String,
    pub password: String,
    pub created_at: Option<DateTime>,
}


#[derive(Debug, Deserialize)]
pub struct LoginUserSchema {
    pub email: String,
    pub password: String,
}

//Muy importante
#[derive(Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub _id: String,
    pub username: String,
    pub iat: usize,
    pub exp: usize,
}

#[derive(Debug, Clone)]
pub struct UserIdentifier {
    pub user_id: String,
    pub user_name: String,
}

