use tauri::{AppHandle, Manager};
use crate::core::packmaker::{SharedPackMaker, PackMetadata, get_public_pack};
use crate::core::beatmap::monitoring::CurrentBeatmapWithRates;
use crate::core::packmaker::add_current_to_pack;

#[tauri::command]
pub async fn add_to_pack(app_handle: AppHandle) -> Result<(), String> {
    let pack = app_handle.state::<SharedPackMaker>();
    let current = app_handle.state::<CurrentBeatmapWithRates>();
    let guard = current.lock().await;
    add_current_to_pack(&pack, &guard).await
}

#[tauri::command]
pub async fn get_pack(app_handle: AppHandle) -> Result<(PackMetadata, Vec<crate::core::packmaker::PublicBeatmapData>), String> {
    let pack = app_handle.state::<SharedPackMaker>();
    Ok(get_public_pack(&pack).await)
}

#[tauri::command]
pub async fn update_pack_metadata(app_handle: AppHandle, metadata: PackMetadata) -> Result<(), String> {
    let pack = app_handle.state::<SharedPackMaker>();
    let mut guard = pack.lock().await;
    guard.metadata = metadata;
    Ok(())
}

