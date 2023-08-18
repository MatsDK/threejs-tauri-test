use std::{fs, path::PathBuf};

use notify::{RecursiveMode, Watcher};

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

    pub fn watch_local_data_dir(&self) -> notify::Result<()> {
        let mut watcher = notify::recommended_watcher(|res| match res {
            Ok(event) => println!("event: {:?}", event),
            Err(e) => println!("watch error: {:?}", e),
        })?;

        watcher.watch(
            self.local_data_path.as_ref().unwrap().as_path(),
            RecursiveMode::Recursive,
        )?;
        // println!("{:?}", self.local_data_path);

        Ok(())
    }

    pub fn get_configs(&self) -> Vec<Config> {
        self.configs.clone()
    }

    pub fn load_configs(&mut self) {
        self.configs = load_configs(self.local_data_path.as_ref().unwrap())
    }
}
