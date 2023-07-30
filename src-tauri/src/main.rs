// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::Duration;

use tokio::sync::oneshot;

#[taurpc::procedures(export_to = "../src/bindings.ts")]
trait Api {
    #[taurpc(alias = "_hello_world_")]
    async fn hello_world();

    #[taurpc(event)]
    async fn event_test();
}

#[derive(Clone)]
struct ApiImpl;

#[taurpc::resolvers]
impl Api for ApiImpl {
    async fn hello_world(self) {
        println!("Hello world");
    }
}

#[tokio::main]
async fn main() {
    let (tx, rx) = oneshot::channel();

    tokio::spawn(async move {
        let app_handle = rx.await.unwrap();
        let trigger = TauRpcApiEventTrigger::new(app_handle);

        let mut interval = tokio::time::interval(Duration::from_secs(1));
        loop {
            interval.tick().await;

            trigger.hello_world()?;
        }

        #[allow(unreachable_code)]
        Ok::<(), tauri::Error>(())
    });

    tauri::Builder::default()
        .invoke_handler(taurpc::create_ipc_handler(ApiImpl.into_handler()))
        .setup(|app| {
            tx.send(app.handle()).unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
