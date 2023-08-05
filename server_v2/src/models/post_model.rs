use mongodb::bson::DateTime;
use mongodb::bson::oid::ObjectId;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Post {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub category: String,
    pub title: String,
    pub message: String,
    pub name: String,
    pub creator: String,
    pub cellphone: String,
    pub city: String,
    pub tags: Vec<String>,
    pub selectedFile: Vec<String>,
    pub likes: Vec<String>,
    pub comments: Vec<String>,
    #[serde(rename = "createdAt")]
    pub created_at: Option<DateTime>,
    pub inCarousel: bool,
    pub topBannerUploadedIn: Option<DateTime>
}
