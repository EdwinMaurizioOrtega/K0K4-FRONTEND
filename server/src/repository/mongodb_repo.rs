use std::env;
use std::io::ErrorKind;
use actix_web::web::BufMut;

extern crate dotenv;
use dotenv::dotenv;

use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, extjson::de::Error, oid::ObjectId},
    results::{DeleteResult, InsertOneResult, UpdateResult},
    Client, Collection,
};
use mongodb::options::FindOptions;
use crate::models::post_model::{ImageFile, Post};

use crate::models::user_model::User;

pub struct MongoRepo {
    user_col: Collection<User>,
    post_col: Collection<Post>, // Agregar colección para "Post"
}

impl MongoRepo {
    pub async fn init() -> Self {
        dotenv().ok();
        let uri = match env::var("MONGOURI") {
            Ok(v) => v.to_string(),
            Err(_) => format!("Error loading env variable."),
        };
        let client = Client::with_uri_str(uri)
            .await
            .expect("Error connecting to database.");
        let db = client.database("rustDB");
        let user_col: Collection<User> = db.collection("User");
        let post_col: Collection<Post> = db.collection("Post"); // Crear colección para "Post"

        MongoRepo {
            user_col,
            post_col,
        }
    }

    pub async fn create_user(&self, new_user: User) -> Result<InsertOneResult, Error> {
        let new_doc = User {
            id: None,
            username: new_user.username,
            email: new_user.email,
            password: new_user.password,
            created_at:  new_user.created_at,
        };

        println!("Contenido de data: {:?}", new_doc);

        let user = self
            .user_col
            .insert_one(new_doc, None)
            .await
            .ok()
            .expect("Error creating user");

        Ok(user)
    }

    pub async fn get_user(&self, id: &String) -> Result<User, Error> {
        let obj_id = ObjectId::parse_str(id).unwrap();
        let filter = doc! {"_id": obj_id};
        let user_detail = self
            .user_col
            .find_one(filter, None)
            .await
            .ok()
            .expect("Error getting user's detail");

        Ok(user_detail.unwrap())
    }

    pub async fn get_user_by_email(&self, email: &String) -> Option<User> {
        let filter = doc! {"email": email};
        if let Some(user_detail) = self.user_col.find_one(filter, None).await.unwrap() {
            Some(user_detail)
        } else {
            None
        }
    }

    pub async fn update_user(&self, id: &String, new_user: User) -> Result<UpdateResult, Error> {
        let obj_id = ObjectId::parse_str(id).unwrap();
        let filter = doc! {"_id": obj_id};
        let new_doc = doc! {
            "$set":
                {
                    "id": new_user.id,
                    "username": new_user.username,
                    "email": new_user.email,
                    "password": new_user.password
                },
        };
        let updated_doc = self
            .user_col
            .update_one(filter, new_doc, None)
            .await
            .ok()
            .expect("Error updating user");
        Ok(updated_doc)
    }

    pub async fn delete_user(&self, id: &String) -> Result<DeleteResult, Error> {
        let obj_id = ObjectId::parse_str(id).unwrap();
        let filter = doc! {"_id": obj_id};
        let user_detail = self
            .user_col
            .delete_one(filter, None)
            .await
            .ok()
            .expect("Error deleting user");

        Ok(user_detail)
    }

    pub async fn get_all_users(&self) -> Result<Vec<User>, Error> {
        let mut cursors = self
            .user_col
            .find(None, None)
            .await
            .ok()
            .expect("Error getting list of users");
        let mut users: Vec<User> = Vec::new();
        while let Some(user) = cursors
            .try_next()
            .await
            .ok()
            .expect("Error mapping through cursor")
        {
            users.push(user)
        }
        Ok(users)
    }


    //Crear un Post
    pub async fn create_post(&self, new_post: Post) -> Result<InsertOneResult, Error> {

        println!("{:?}", new_post);

        let selected_files_aux = new_post
            .selected_file
            .into_iter()
            .map(|sf| ImageFile {
                id: None,
                file_name: sf.file_name,
                file_type: sf.file_type,
                file_url: sf.file_url,
            })
            .collect::<Vec<_>>();

        let new_doc = Post {
            id: None,
            title: new_post.title,
            category: new_post.category,
            message: new_post.message,
            name: new_post.name,
            creator: new_post.creator,
            cellphone: new_post.cellphone,
            city: new_post.city,
            selected_file: selected_files_aux,
            likes: vec![],
            comments: vec![],
            created_at:  new_post.created_at,
            in_carousel: false,
            tags: vec![],
            top_banner_uploaded_in: None,
        };
        let post = self
            .post_col
            .insert_one(new_doc, None)
            .await
            .ok()
            .expect("Error creating post");
        Ok(post)
    }


    pub async fn get_post_by_id(&self, id: &String) -> Result<Post, Error> {
        let obj_id = ObjectId::parse_str(id).unwrap();
        let filter = doc! {"_id": obj_id};
        let post_detail = self
            .post_col
            .find_one(filter, None)
            .await
            .ok()
            .expect("Error getting user's detail");

        Ok(post_detail.unwrap())
    }


    pub async fn get_all_posts_by_creator(&self, id: &String) -> Result<Vec<Post>, Error> {

        let filter = doc! {"creator": id};

        let mut cursors = self
            .post_col
            .find(filter, None)
            .await
            .ok()
            .expect("Error getting list of users");

        let mut posts: Vec<Post> = Vec::new();

        while let Some(user) = cursors
            .try_next()
            .await
            .ok()
            .expect("Error mapping through cursor")
        {
            posts.push(user)
        }
        Ok(posts)
    }

    pub async fn get_posts_in_carousel(&self, category: &String, city: &String) -> Result<Vec<Post>, Error> {

        let mut query = doc! {
            "in_carousel": true,
            "top_banner_uploaded_in": { "$exists": true }
        };

        if category != "undefined" {
            query.insert("category", category);
        }

        if city != "undefined" {
            query.insert("city", city);
        }

        let options = FindOptions::builder()
            .sort(doc! {"top_banner_uploaded_in": -1})
            .limit(10)
            .build();

        let mut cursor = self
            .post_col
            .find(query.clone(), options)
            .await
            .ok()
            .expect("Error getting list of users");

        let mut posts: Vec<Post> = Vec::new();

        while let Some(user) = cursor
            .try_next()
            .await
            .ok()
            .expect("Error mapping through cursor")
        {
            posts.push(user)
        }
        Ok(posts)
    }

    pub async fn get_posts(&self, page: i64, category: Option<&String>, city: Option<&String>) -> Result<Vec<Post>, Error> {

        println!("Número de página: {}", page);

        const LIMIT: i64 = 30;

        // Calcular el índice de inicio para la página actual
        let start_index = (page - 1) * LIMIT;

        println!("start_index: {}", start_index);

        let mut query = doc! {};

        if let Some(cat) = category {
            if cat != "undefined" {
                query.insert("category", cat);
            }
        }

        if let Some(cit) = city {
            if cit != "undefined" {
                query.insert("city", cit);
            }
        }

        let options = FindOptions::builder()
            .sort(doc! {"_id": -1})
            .skip(u64::try_from((page - 1) * LIMIT).unwrap())
            .limit(LIMIT)
            .build();

        let mut cursor = self
            .post_col
            .find(query.clone(), options)
            .await
            .ok()
            .expect("Error getting list of users");


        let mut posts: Vec<Post> = Vec::new();

        while let Some(user) = cursor
            .try_next()
            .await
            .ok()
            .expect("Error mapping through cursor")
        {
            posts.push(user)
        }
        Ok(posts)
    }
    pub async fn get_count_documents_posts(&self, page: i64, category: Option<&String>, city: Option<&String>) -> Result<u64, Error> {

        let mut query = doc! {};

        if let Some(cat) = category {
            if cat != "undefined" {
                query.insert("category", cat);
            }
        }

        if let Some(cit) = city {
            if cit != "undefined" {
                query.insert("city", cit);
            }
        }


        let total_result = self
            .post_col
            .count_documents(query.clone(), None)
            .await
            .ok()
            .expect("Error getting list of users");



        Ok(total_result)
    }

    pub async fn delete_post_by_id(&self, id: &String) -> Result<(), ()> {
        let obj_id = ObjectId::parse_str(id).unwrap();
        let filter = doc! {"_id": obj_id};

        match self.post_col.delete_one(filter, None).await {
            Ok(_) => Ok(()), // Éxito, el documento se eliminó correctamente
            Err(e) => Err(()), // Ocurrió un error al eliminar el documento
        }
    }

}
