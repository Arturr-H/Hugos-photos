#![allow(dead_code)]

/* Imports */
use std::{ collections::HashMap, fs::File, io::{Read, Write} };
use bincode;
use serde_derive::{ Deserialize, Serialize };

/* Constants */
const PATH_TO_APPDATA_SAVE:&'static str = "./appdata";

/* Global app data */
#[derive(Deserialize, Serialize)]
pub struct AppData {
    collections: HashMap<String, Collection>
}

/* Image collection */
#[derive(Deserialize, Serialize)]
pub struct Collection {
    pub images: Vec<Image>,
    pub title: String,
}

/* Image */
#[derive(Deserialize, Serialize)]
pub struct Image {
    pub date: usize,
    pub camera: String,
    pub place: String,

    pub pathname: String
}

/* Method implementations */
impl AppData {
    pub fn collections(&self) -> &HashMap<String, Collection> { &self.collections }
    pub fn new() -> Self { Self { collections: HashMap::new() } }

    /* Save / retrieve */
    pub fn from_file() -> Self {
        let mut file = File::open(PATH_TO_APPDATA_SAVE).unwrap();
        let mut buffer = Vec::new();
        file.read_to_end(&mut buffer).unwrap();
        bincode::deserialize(&buffer).unwrap()
    }
    pub fn save(&self) -> () {
        let mut file = File::create(PATH_TO_APPDATA_SAVE).unwrap();
        let buffer = bincode::serialize(&self).unwrap();
        file.write_all(&buffer).unwrap();
    }
}
impl Collection {
    pub fn images(&mut self) -> &mut Vec<Image> { &mut self.images }
    pub fn title(&self) -> &String { &self.title }
}
impl Image {
    pub fn date(&self) -> &String { &self.date }
    pub fn camera(&self) -> &String { &self.camera }
    pub fn place(&self) -> &String { &self.place }
    pub fn pathname(&self) -> &String { &self.pathname }
}
