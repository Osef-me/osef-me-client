use super::helpers::{calculate_progress, emit_status, update_status};
use futures_util::StreamExt;
use reqwest::Response;
use tauri::AppHandle;

const PROGRESS_UPDATE_INTERVAL: u64 = 100 * 1024; // 100KB

/// Stream download with progress tracking
pub async fn stream_download(
    response: Response,
    beatmapset_id: i32,
    app_handle: &AppHandle,
) -> Result<Vec<u8>, String> {
    let total_size = response.content_length().unwrap_or(0);

    // Update total size
    update_status(beatmapset_id, |status| {
        status.total_bytes = Some(total_size);
    });
    emit_status(app_handle);

    let mut stream = response.bytes_stream();
    let mut downloaded: u64 = 0;
    let mut buffer = Vec::with_capacity(total_size as usize);

    while let Some(chunk_result) = stream.next().await {
        let chunk = chunk_result.map_err(|e| format!("Stream error: {}", e))?;

        downloaded += chunk.len() as u64;
        buffer.extend_from_slice(&chunk);

        let progress = calculate_progress(downloaded, total_size);

        update_status(beatmapset_id, |status| {
            status.downloaded_bytes = downloaded;
            status.progress = progress;
        });

        // Emit updates periodically
        if should_emit_update(downloaded, total_size, chunk.len() as u64) {
            emit_status(app_handle);
        }
    }

    Ok(buffer)
}

fn should_emit_update(downloaded: u64, total: u64, chunk_size: u64) -> bool {
    downloaded % PROGRESS_UPDATE_INTERVAL < chunk_size || downloaded == total
}
