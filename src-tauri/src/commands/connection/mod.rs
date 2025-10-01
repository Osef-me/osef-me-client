pub(crate) mod helpers;
pub(crate) mod monitoring;
mod types;

use crate::beatmap::monitoring::CurrentBeatmapWithRates;
use helpers::emit_status;
use monitoring::start_monitoring;
use tauri::{AppHandle, Manager};
pub use types::ConnectionStatus;

/// Command to restart the osu! monitoring connection
#[tauri::command]
pub async fn restart_osu_connection(app_handle: AppHandle) -> Result<String, String> {
    println!("🔄 Restarting osu! connection...");

    // Emit reconnecting status
    emit_status(&app_handle, ConnectionStatus::reconnecting());

    // Get current beatmap state
    let current_beatmap = app_handle.state::<CurrentBeatmapWithRates>();
    let current_beatmap_clone = current_beatmap.inner().clone();

    // Spawn monitoring thread
    spawn_monitoring_thread(app_handle, current_beatmap_clone);

    Ok("Reconnection started".to_string())
}

/// Spawn a new thread for osu! monitoring
fn spawn_monitoring_thread(app_handle: AppHandle, current_beatmap: CurrentBeatmapWithRates) {
    std::thread::spawn(move || {
        tauri::async_runtime::block_on(async {
            start_monitoring(app_handle, current_beatmap).await;
        });
    });
}

