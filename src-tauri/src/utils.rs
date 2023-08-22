use crate::ipc::Config;
use std::{fs, io, path::PathBuf};

pub fn get_models_dir(path: PathBuf) -> PathBuf {
    path.join("models")
}

pub fn load_configs(path: &PathBuf) -> io::Result<Vec<Config>> {
    let mut configs = vec![];

    for entry in fs::read_dir(path)? {
        let entry = entry?;
        let path = entry.path();
        println!("loading {:?}", path);

        if path.extension().is_none() || path.extension().unwrap() != "json" {
            continue;
        }

        let file = fs::read_to_string(path)?;
        let config = serde_json::from_str(&file)?;
        configs.push(config);
    }
    Ok(configs)
}
