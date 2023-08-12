use std::{fs, path::PathBuf};

use crate::Config;

pub fn get_models_dir(path: PathBuf) -> PathBuf {
    path.join("models")
}

pub fn load_configs(path: &PathBuf) -> Vec<Config> {
    let mut configs = vec![];

    for entry in fs::read_dir(path).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.extension().unwrap() != "json" {
            continue;
        }

        let file = fs::read_to_string(path).unwrap();
        let config = serde_json::from_str(&file).unwrap();
        configs.push(config);
    }
    configs
}
