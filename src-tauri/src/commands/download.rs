use crate::core::download as download_core;
use tauri::AppHandle;

#[tauri::command]
pub async fn download_beatmap_from_url(
    app_handle: AppHandle,
    url: String,
    filename: String,
    beatmapset_name: String,
    creator: String,
) -> Result<String, String> {
    download_core::download_beatmap_from_url(app_handle, url, filename, beatmapset_name, creator)
        .await
}

#[tauri::command]
pub async fn test_download_event(
    app_handle: AppHandle,
    beatmapset_id: i32,
) -> Result<String, String> {
    download_core::test_download_event(app_handle, beatmapset_id).await
}
