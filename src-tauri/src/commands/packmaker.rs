use tauri::{AppHandle, Manager};
use crate::core::packmaker::{SharedPackMaker, PackMetadata, get_public_pack, update_pack_beatmap_version, PackBeatmapModifications, update_pack_beatmap, update_pack_beatmap_modifications, apply_pack_beatmap_modifications, get_pack_beatmap_modifications};
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
pub async fn update_pack_beatmap_version_cmd(app_handle: AppHandle, index: usize, new_version: String) -> Result<(), String> {
    let pack = app_handle.state::<SharedPackMaker>();
    update_pack_beatmap_version(&pack, index, new_version).await
}

#[tauri::command]
pub async fn update_pack_beatmap_cmd(app_handle: AppHandle, index: usize, modifications: PackBeatmapModifications) -> Result<(), String> {
    let pack = app_handle.state::<SharedPackMaker>();
    update_pack_beatmap(&pack, index, modifications).await
}

#[tauri::command]
pub async fn update_pack_metadata(app_handle: AppHandle, metadata: PackMetadata) -> Result<(), String> {
    let pack = app_handle.state::<SharedPackMaker>();
    let mut guard = pack.lock().await;
    guard.metadata = metadata;
    Ok(())
}

#[tauri::command]
pub async fn update_pack_beatmap_modifications_cmd(app_handle: AppHandle, index: usize, modifications: PackBeatmapModifications) -> Result<(), String> {
    let pack = app_handle.state::<SharedPackMaker>();
    update_pack_beatmap_modifications(&pack, index, modifications).await
}

#[tauri::command]
pub async fn apply_pack_beatmap_modifications_cmd(app_handle: AppHandle, index: usize) -> Result<(), String> {
    let pack = app_handle.state::<SharedPackMaker>();
    apply_pack_beatmap_modifications(&pack, index).await
}

#[tauri::command]
pub async fn get_pack_beatmap_modifications_cmd(app_handle: AppHandle, index: usize) -> Result<PackBeatmapModifications, String> {
    let pack = app_handle.state::<SharedPackMaker>();
    get_pack_beatmap_modifications(&pack, index).await
}


