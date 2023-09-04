use mongodb::bson::DateTime;
use mongodb::bson::oid::ObjectId;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Post {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub title: String,
    pub category: String,
    pub message: String,
    pub name: String,
    pub creator: String,
    pub cellphone: String,
    pub city: String,
    pub tags: Vec<String>,
    pub selected_file: Vec<ImageFile>,
    pub likes: Vec<String>,
    pub comments: Vec<String>,
    // #[serde(rename = "createdAt")]
    pub created_at: Option<DateTime>,
    pub in_carousel: bool,
    pub top_banner_uploaded_in: Option<DateTime>
}

#[derive(Debug, Serialize, Deserialize, Clone)]// Agrega "Clone" aquí
pub struct ImageFile {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub file_name: String,
    pub file_type: String,
    pub file_url: String
}


#[derive(serde::Deserialize)]
pub struct QueryParams {
    pub creator: String,
}


#[derive(serde::Deserialize)]
pub struct GetPostsInCarousel {
    pub category: String,
    pub city: String,
}


#[derive(serde::Deserialize)]
pub struct GetPostsPerPage {
    pub page: Option<i64>,
    pub category: Option<String>,
    pub city: Option<String>,
}