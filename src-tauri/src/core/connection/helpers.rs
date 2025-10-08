use super::types::ConnectionStatus;
use tauri::{AppHandle, Emitter};

/// Emit connection status to frontend
pub(crate) fn emit_status(app_handle: &AppHandle, status: ConnectionStatus) {
    let is_connected = status.connected;

    if let Err(e) = app_handle.emit("connection-status", status) {
        eprintln!("❌ Error emitting connection status: {}", e);
        return;
    }

    if is_connected {
        println!("✅ Connection status: Connected to osu!");
    } else {
        println!("❌ Connection status: Failed to connect");
    }
}

/// Check if error indicates osu! is not running
pub fn is_osu_not_running_error(error: &str) -> bool {
    error.contains("Process not found")
        || error.contains("osu!.exe not found")
        || error.contains("Access denied")
        || error.contains("could not find osu process")
}
