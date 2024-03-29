#![allow(dead_code)]

/* Imports */
use std::{ collections::HashMap, fs::File, io::{Read, Write} };
use bincode;
use serde_derive::{ Deserialize, Serialize };

/* Constants */
const PATH_TO_APPDATA_SAVE:&'static str = "./mount/appdata";

/* Global app data */
#[derive(Deserialize, Serialize, Debug)]
pub struct AppData {
    pub collections: HashMap<String, Collection>,
}

/* Image collection */
#[derive(Deserialize, Serialize, Debug)]
pub struct Collection {
    pub images: Vec<Image>,
    pub title: Vec<u8>,
    pub cover_image: Image,
    pub date: String
}

/* Image */
#[derive(Deserialize, Serialize, Debug)]
pub struct Image {
    pub date: String,
    pub camera: Vec<u8>,
    pub place: Vec<u8>,
    pub title: Vec<u8>,

    pub pathname: String
}

/* Method implementations */
impl AppData {
    pub fn new() -> Self { Self { collections: HashMap::new() } }

    /* Save / retrieve */
    pub fn from_file() -> Self {
        let mut file = File::open(PATH_TO_APPDATA_SAVE).expect("Should crash (1x1121)");
        let mut buffer = Vec::new();
        file.read_to_end(&mut buffer).expect("Should crash (1x1122)");
        bincode::deserialize(&buffer).expect("Should crash (1x1123)")
    }
    pub fn save(&self) -> Option<()> {
        let mut file = File::create(PATH_TO_APPDATA_SAVE).ok()?;
        let buffer = bincode::serialize(&self).ok()?;
        file.write_all(&buffer).ok()?;

        Some(())
    }
}
impl Collection {
    pub fn images(&mut self) -> &mut Vec<Image> { &mut self.images }
    pub fn title(&self) -> &Vec<u8> { &self.title }
    pub fn date(&self) -> &String { &self.date }
}
impl Image {
    pub fn date(&self) -> &String { &self.date }
    pub fn camera(&self) -> &Vec<u8> { &self.camera }
    pub fn place(&self) -> &Vec<u8> { &self.place }
    pub fn pathname(&self) -> &String { &self.pathname }
}
