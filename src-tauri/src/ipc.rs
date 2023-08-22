use crate::state::ConfigsState;
use std::sync::Arc;
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
    tcp_offset: [f32; 3],
}

#[taurpc::procedures(export_to = "../src/lib/bindings.ts")]
pub trait RootApi {
    async fn get_configs() -> Vec<Config>;
}

pub type AppState = Arc<Mutex<ConfigsState>>;

#[derive(Clone)]
pub struct RootApiImpl {
    pub state: AppState,
}

#[taurpc::resolvers]
impl RootApi for RootApiImpl {
    async fn get_configs(self) -> Vec<Config> {
        self.state.lock().await.get_configs()
    }
}

#[taurpc::procedures(path = "events", event_trigger = EventsTrigger)]
pub trait Events {
    #[taurpc(event)]
    async fn configs_changed(configs: Vec<Config>);
}

#[derive(Clone)]
pub struct EventsImpl;

#[taurpc::resolvers]
impl Events for EventsImpl {}
