// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod ipc;
mod state;
mod utils;

use ipc::*;

use state::ConfigsState;
use std::sync::Arc;
use tauri::Manager;
use tokio::sync::Mutex;

#[tokio::main]
async fn main() {
    let state = Arc::new(Mutex::new(ConfigsState::new()));

    let router = taurpc::Router::new()
        .merge(
            RootApiImpl {
                state: state.clone(),
            }
            .into_handler(),
        )
        .merge(EventsImpl.into_handler());

    tauri::Builder::default()
        .invoke_handler(router.into_handler())
        .setup(move |app| {
            app.get_window("main").unwrap().open_devtools();

            let app_handle = app.handle();
            let state = state.clone();
            tokio::spawn(async move {
                let path = app_handle.path_resolver().app_local_data_dir().unwrap();
                let mut state = state.lock().await;
                state.set_local_data_path(path);
                // Already start loading the configs
                state.load_configs();
                // drop(state);

                state.watch_local_data_dir().unwrap();
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
