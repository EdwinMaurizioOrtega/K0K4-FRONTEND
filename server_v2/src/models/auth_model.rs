use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Auth {
    pub authorization: String,
}