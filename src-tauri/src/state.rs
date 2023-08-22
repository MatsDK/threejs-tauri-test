use crate::{
    ipc::{AppState, Config, EventsTrigger},
    utils::{get_models_dir, load_configs},
};
use notify::Watcher;
use std::{fs, path::PathBuf};
use tauri::AppHandle;

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
        match load_configs(self.local_data_path.as_ref().unwrap()) {
            Ok(configs) => self.configs = configs,
            Err(e) => {
                eprintln!("Error while loading configs: {e}")
            }
        }
    }
}

pub async fn watch_local_data_dir(
    path: &PathBuf,
    state: AppState,
    app_handle: AppHandle,
) -> notify::Result<()> {
    let (tx, rx) = std::sync::mpsc::channel();
    let mut watcher = notify::RecommendedWatcher::new(tx, notify::Config::default())?;

    // let path = self.local_data_path.as_ref().unwrap();
    watcher.watch(&path, notify::RecursiveMode::Recursive)?;

    let event_trigger = EventsTrigger::new(app_handle);

    for res in rx {
        match res {
            Ok(_event) => {
                // match event.kind {
                // EventKind::Modify(d) => {
                //     println!("Modify event: {d:?}")
                // }
                // _ => {
                //     println!("Other event: {event:?}")
                // }
                // }

                let mut state = state.lock().await;
                state.load_configs();
                let configs = state.get_configs();

                event_trigger.configs_changed(configs).unwrap();
            }
            Err(error) => eprintln!("Error: {error:?}"),
        }
    }

    Ok(())
}
