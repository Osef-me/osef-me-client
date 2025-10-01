mod models;
mod beatmap;
mod calc;
mod init_loop;
mod commands;

use beatmap::monitoring::CurrentBeatmapWithRates;
use commands::connection::monitoring::start_monitoring;
use tauri::{AppHandle, Manager};
use std::sync::Arc;
use tokio::sync::Mutex;

/// Spawn initial monitoring thread on app startup
fn spawn_initial_monitoring(app_handle: AppHandle, current_beatmap: CurrentBeatmapWithRates) {
    std::thread::spawn(move || {
        tauri::async_runtime::block_on(async {
            start_monitoring(app_handle, current_beatmap).await;
        });
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Initialiser le CurrentBeatmapWithRates state
            let current_beatmap: CurrentBeatmapWithRates = Arc::new(Mutex::new(None));
            app.manage(current_beatmap.clone());
            
            println!("✅ App initialized");
            
            // Start monitoring in background
            spawn_initial_monitoring(app.handle().clone(), current_beatmap);
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            crate::commands::beatmap::get_current_beatmap,
            crate::commands::beatmap::get_all_rates,
            crate::commands::beatmap::apply_beatmap_modifications,
            crate::commands::beatmap::emit_demo_beatmap,
            crate::commands::connection::restart_osu_connection,
            crate::commands::download::download_beatmap_from_url,
            crate::commands::download::test_download_event,
            crate::commands::settings::get_songs_path,
            crate::commands::settings::set_songs_path,
            crate::commands::settings::get_theme,
            crate::commands::settings::set_theme
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
