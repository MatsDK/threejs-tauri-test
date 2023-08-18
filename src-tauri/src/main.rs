// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod state;
mod utils;
use std::sync::Arc;

use state::ConfigsState;
use tauri::Manager;
use tokio::sync::Mutex;

#[taurpc::ipc_type]
pub struct Constraint {
    axis: String,
    min: f32,
    home: f32,
    max: f32,
}

#[taurpc::ipc_type]
pub struct Joint {
    name: String,
    id: String,
    mesh_id: String,
    constraints: Option<Constraint>,
}

#[taurpc::ipc_type]
pub struct Config {
    name: String,
    description: String,
    model_path: String,
    joints: Vec<Joint>,
}

#[taurpc::procedures(export_to = "../src/lib/bindings.ts")]
trait RootApi {
    async fn get_configs() -> Vec<Config>;
}

#[derive(Clone)]
struct RootApiImpl {
    state: AppState,
}

#[taurpc::resolvers]
impl RootApi for RootApiImpl {
    async fn get_configs(self) -> Vec<Config> {
        self.state.lock().await.get_configs()
    }
}

#[taurpc::procedures(path = "events", event_trigger = EventsTrigger)]
trait Events {
    #[taurpc(event)]
    async fn configs_changed();
}

#[derive(Clone)]
struct EventsImpl;

#[taurpc::resolvers]
impl Events for EventsImpl {}

type AppState = Arc<Mutex<ConfigsState>>;

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
