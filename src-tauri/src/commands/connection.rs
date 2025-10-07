use tauri::AppHandle;
use crate::core::connection::restart_osu_connection as core_restart_osu_connection;

#[tauri::command]
pub async fn restart_osu_connection(app_handle: AppHandle) -> Result<String, String> {
    core_restart_osu_connection(app_handle)
        .await
        .map(|_| "Reconnection started".to_string())
}
