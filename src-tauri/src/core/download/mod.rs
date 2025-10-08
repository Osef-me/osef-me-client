mod helpers;
mod http;
mod stream;
mod types;

use crate::core::preferences;
use helpers::{emit_status, mark_completed, mark_failed, update_status};
use http::fetch_beatmap;
use std::fs;
use std::path::PathBuf;
use stream::stream_download;
use tauri::AppHandle;
use types::{DownloadState, DownloadStatus, DOWNLOAD_MANAGER, DOWNLOAD_SEMAPHORE};

/// Test download event for debugging (core)
pub async fn test_download_event(
    app_handle: AppHandle,
    beatmapset_id: i32,
) -> Result<String, String> {
    if let Ok(mut manager) = DOWNLOAD_MANAGER.lock() {
        manager.insert(
            beatmapset_id,
            DownloadStatus {
                beatmapset_id,
                filename: format!("test_{}.osz", beatmapset_id),
                display_name: "Test Beatmap by Test Creator".to_string(),
                status: DownloadState::Downloading,
                progress: 50.0,
                error: None,
                downloaded_bytes: 512000,
                total_bytes: Some(1024000),
            },
        );
    }

    emit_status(&app_handle);
    Ok("Test event emitted".to_string())
}

/// Queue and start a download from URL (core)
pub async fn download_beatmap_from_url(
    app_handle: AppHandle,
    url: String,
    filename: String,
    beatmapset_name: String,
    creator: String,
) -> Result<String, String> {
    let beatmapset_id = extract_beatmapset_id(&filename);
    let display_name = format!("{} by {}", beatmapset_name, creator);

    // Queue download
    queue_download(beatmapset_id, filename.clone(), display_name);
    emit_status(&app_handle);

    // Start download in background
    tauri::async_runtime::spawn(async move {
        let result = download_beatmap(app_handle.clone(), beatmapset_id, url, filename).await;

        if let Err(e) = result {
            eprintln!("❌ Download failed for beatmap {}: {}", beatmapset_id, e);
        }
    });

    Ok(format!("Download started for {}", beatmapset_name))
}

/// Extract beatmapset ID from filename
fn extract_beatmapset_id(filename: &str) -> i32 {
    filename
        .strip_suffix(".osz")
        .and_then(|s| s.parse::<i32>().ok())
        .unwrap_or(0)
}

/// Add download to queue
fn queue_download(beatmapset_id: i32, filename: String, display_name: String) {
    if let Ok(mut manager) = DOWNLOAD_MANAGER.lock() {
        manager.insert(
            beatmapset_id,
            DownloadStatus {
                beatmapset_id,
                filename,
                display_name,
                status: DownloadState::Queued,
                progress: 0.0,
                error: None,
                downloaded_bytes: 0,
                total_bytes: None,
            },
        );
    }
}

/// Execute download process
async fn download_beatmap(
    app_handle: AppHandle,
    beatmapset_id: i32,
    url: String,
    filename: String,
) -> Result<(), String> {
    // Load config and prepare paths
    let songs_path = get_songs_path()?;
    ensure_directory_exists(&songs_path)?;

    let file_path = songs_path.join(&filename);

    // Update status to downloading
    update_status(beatmapset_id, |status| {
        status.status = DownloadState::Downloading;
    });
    emit_status(&app_handle);

    // Acquire download slot
    let _permit = DOWNLOAD_SEMAPHORE.acquire().await;

    // Fetch and stream download
    let response = fetch_beatmap(&url).await.map_err(|e| {
        mark_failed(&app_handle, beatmapset_id, e.clone());
        e
    })?;

    let _ = response.content_length();

    let buffer = stream_download(response, beatmapset_id, &app_handle)
        .await
        .map_err(|e| {
            mark_failed(&app_handle, beatmapset_id, e.clone());
            e
        })?;

    // Save file
    save_file(&file_path, &buffer).map_err(|e| {
        mark_failed(&app_handle, beatmapset_id, e.clone());
        e
    })?;

    mark_completed(&app_handle, beatmapset_id);

    Ok(())
}

/// Get songs path from config
fn get_songs_path() -> Result<PathBuf, String> {
    let config = std::panic::catch_unwind(preferences::load_config)
        .map_err(|_| "Failed to load config".to_string())?;

    Ok(PathBuf::from(&config.songs_path))
}

/// Ensure directory exists
fn ensure_directory_exists(path: &PathBuf) -> Result<(), String> {
    if !path.exists() {
        fs::create_dir_all(path).map_err(|e| format!("Failed to create directory: {}", e))?;
    }
    Ok(())
}

/// Save buffer to file
fn save_file(path: &PathBuf, data: &[u8]) -> Result<(), String> {
    fs::write(path, data).map_err(|e| format!("Failed to save file: {}", e))
}
