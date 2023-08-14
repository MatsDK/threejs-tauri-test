use std::{fs, path::PathBuf};

use crate::{
    utils::{get_models_dir, load_configs},
    Config,
};

#[derive(Default)]
pub struct ConfigsState {
    pub local_data_path: Option<PathBuf>,
    configs: Vec<Config>,
}

impl ConfigsState {
    pub fn new() -> Self {
        Self {
            configs: vec![],
            local_data_path: None,
        }
    }

    pub fn set_local_data_path(&mut self, path: PathBuf) {
        let path = get_models_dir(path);
        // Create dir if it doesn't exist
        if !path.exists() {
            if let Err(err) = fs::create_dir_all(&path) {
                eprintln!("Error creating directory: {}", err);
            }
        }
        self.local_data_path = Some(path);
    }

    pub fn get_configs(&self) -> Vec<Config> {
        self.configs.clone()
    }

    pub fn load_configs(&mut self) {
        self.configs = load_configs(self.local_data_path.as_ref().unwrap())
    }
}
