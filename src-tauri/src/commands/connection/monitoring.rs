use crate::beatmap::monitoring::{beatmap_monitoring_loop, CurrentBeatmapWithRates};
use crate::init_loop::init_loop;
use super::helpers::{emit_status, is_osu_not_running_error};
use super::types::ConnectionStatus;
use minacalc_rs::Calc;
use tauri::AppHandle;

/// Initialize connection to osu! and start monitoring
pub(crate) async fn start_monitoring(
    app_handle: AppHandle,
    current_beatmap: CurrentBeatmapWithRates,
) {
    println!("🔍 Starting memory reading...");

    // Try to initialize connection
    let (mut state, process) = match init_loop(500) {
        Ok(result) => {
            println!("✅ Connected to osu! - Starting beatmap monitoring...");
            emit_status(&app_handle, ConnectionStatus::connected());
            result
        }
        Err(e) => {
            handle_init_error(&app_handle, e);
            return;
        }
    };

    // Start monitoring loop
    let calc = Calc::default();
    if let Err(e) = beatmap_monitoring_loop(
        app_handle.clone(),
        current_beatmap,
        &mut state,
        &process,
        &calc,
    )
    .await
    {
        eprintln!("❌ Beatmap monitoring error: {}", e);
        emit_status(&app_handle, ConnectionStatus::disconnected(e.to_string()));
    }
}

/// Handle initialization errors
fn handle_init_error(app_handle: &AppHandle, error: rosu_memory_lib::Error) {
    let error_msg = error.to_string();
    eprintln!("❌ Initialization error: {}", error_msg);
    
    emit_status(app_handle, ConnectionStatus::disconnected(error_msg.clone()));

    if is_osu_not_running_error(&error_msg) {
        println!("⚠️ Osu! not running - monitoring stopped");
    } else {
        println!("⚠️ Unknown initialization error - monitoring stopped");
    }
}

