use super::types::{DownloadState, DownloadStatus, DOWNLOAD_MANAGER};
use tauri::{AppHandle, Emitter};

/// Update download status in the manager
pub fn update_status<F>(beatmapset_id: i32, updater: F)
where
    F: FnOnce(&mut DownloadStatus),
{
    if let Ok(mut manager) = DOWNLOAD_MANAGER.lock() {
        if let Some(status) = manager.get_mut(&beatmapset_id) {
            updater(status);
        }
    }
}

/// Emit download status to frontend
pub fn emit_status(app_handle: &AppHandle) {
    let status_list: Vec<DownloadStatus> = DOWNLOAD_MANAGER
        .lock()
        .map(|manager| manager.values().cloned().collect())
        .unwrap_or_default();

    let _ = app_handle.emit("download-status-update", status_list);
}

/// Mark download as failed
pub fn mark_failed(app_handle: &AppHandle, beatmapset_id: i32, error: String) {
    update_status(beatmapset_id, |status| {
        status.status = DownloadState::Failed;
        status.error = Some(error.clone());
    });
    emit_status(app_handle);
}

/// Mark download as completed
pub fn mark_completed(app_handle: &AppHandle, beatmapset_id: i32) {
    update_status(beatmapset_id, |status| {
        status.status = DownloadState::Completed;
        status.progress = 100.0;
    });
    emit_status(app_handle);
}

/// Calculate download progress percentage
pub fn calculate_progress(downloaded: u64, total: u64) -> f32 {
    if total > 0 {
        (downloaded as f64 / total as f64 * 100.0) as f32
    } else {
        0.0
    }
}

/// Format bytes to MB
pub fn format_mb(bytes: u64) -> f64 {
    bytes as f64 / (1024.0 * 1024.0)
}

