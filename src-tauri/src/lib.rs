mod commands;
mod core;

use core::beatmap::monitoring::CurrentBeatmapWithRates;
use core::internal::CurrentBeatmapData;
use core::packmaker::{SharedPackMaker, PackMaker};
use core::connection::monitoring::start_monitoring;
use std::sync::Arc;
use tauri::{AppHandle, Manager};
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
            let current_beatmap: CurrentBeatmapWithRates = Arc::new(Mutex::new(CurrentBeatmapData {
                beatmap_info: None,
                rates: Vec::new(),
                nps_data: None,
            }));
            app.manage(current_beatmap.clone());

            // Initialize PackMaker state
            let pack: SharedPackMaker = Arc::new(Mutex::new(PackMaker::new()));
            app.manage(pack.clone());

            println!("✅ App initialized");

            // Start monitoring in background
            spawn_initial_monitoring(app.handle().clone(), current_beatmap);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            crate::commands::beatmap::get_current_beatmap,
            crate::commands::beatmap::get_all_rates,
            crate::commands::beatmap::get_current_nps,
            crate::commands::beatmap::apply_beatmap_modifications,
            crate::commands::beatmap::emit_demo_beatmap,
            crate::commands::beatmap::calculate_nps_from_beatmap_url,
            crate::commands::connection::restart_osu_connection,
            crate::commands::download::download_beatmap_from_url,
            crate::commands::download::test_download_event,
            crate::commands::preferences::get_songs_path,
            crate::commands::preferences::set_songs_path,
            crate::commands::preferences::get_theme,
            crate::commands::preferences::set_theme,
            crate::commands::packmaker::add_to_pack,
            crate::commands::packmaker::get_pack,
            crate::commands::packmaker::update_pack_metadata
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
