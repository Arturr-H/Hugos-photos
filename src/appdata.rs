#![allow(dead_code)]

/* Imports */
use std::collections::HashMap;

/* Global app data */
pub struct AppData {
    collections: HashMap<String, Collection>
}

/* Image collection */
pub struct Collection {
    images: Vec<Image>,
    title: String,
}

/* Image */
pub struct Image {
    date: String,
    camera: String,
    place: String,

    pathname: String
}

/* Method implementations */
impl AppData {
    pub fn collections(&self) -> &HashMap<String, Collection> { &self.collections }
}
impl Collection {
    pub fn images(&self) -> &Vec<Image> { &self.images }
    pub fn title(&self) -> &String { &self.title }
}
impl Image {
    pub fn date(&self) -> &String { &self.date }
    pub fn camera(&self) -> &String { &self.camera }
    pub fn place(&self) -> &String { &self.place }
    pub fn pathname(&self) -> &String { &self.pathname }
}
