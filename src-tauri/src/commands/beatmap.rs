use crate::core::beatmap::{
    apply_beatmap_modifications_core, emit_demo_beatmap_core, get_all_rates_from_state,
    get_current_beatmap_from_state, get_current_nps_data,
};
use crate::core::calc::nps::calculate_nps_graph;
use crate::core::react::{BeatmapModifications, Beatmapset, NpsData, Rates};
use reqwest;
use tauri::AppHandle;
use rosu_map::Beatmap as RmBeatmap;
use std::str::FromStr;

// Command to get the current beatmap from the global state
#[tauri::command]
pub async fn get_current_beatmap(app_handle: AppHandle) -> Result<Option<Beatmapset>, String> {
    Ok(get_current_beatmap_from_state(&app_handle).await)
}

// Command to get all rates for the current beatmap
#[tauri::command]
pub async fn get_all_rates(app_handle: AppHandle) -> Result<Vec<Rates>, String> {
    Ok(get_all_rates_from_state(&app_handle).await)
}

// Command to get NPS data for the current beatmap
#[tauri::command]
pub async fn get_current_nps(app_handle: AppHandle) -> Result<Option<NpsData>, String> {
    Ok(get_current_nps_data(&app_handle).await)
}

// Command to apply modifications to a beatmap and create a copy
#[tauri::command]
pub async fn apply_beatmap_modifications(
    app_handle: AppHandle,
    modifications: BeatmapModifications,
) -> Result<Beatmapset, String> {
    apply_beatmap_modifications_core(&app_handle, modifications).await
}

// Demo command to emit a beatmap with an incremented counter
#[tauri::command]
pub async fn emit_demo_beatmap(app_handle: AppHandle, counter: u32) -> Result<(), String> {
    emit_demo_beatmap_core(&app_handle, counter)
}

// Command to calculate NPS from a beatmap URL (for remote beatmaps)
#[tauri::command]
pub async fn calculate_nps_from_beatmap_url(beatmap_url: String) -> Result<NpsData, String> {
    // Download the .osu file content
    let client = reqwest::Client::new();
    let response = client
        .get(&beatmap_url)
        .send()
        .await
        .map_err(|e| format!("Failed to download: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("HTTP error: {}", response.status()));
    }

    let osu_content = response
        .text()
        .await
        .map_err(|e| format!("Failed to read content: {}", e))?;

    // Parse the beatmap
    let parsed_beatmap =
        RmBeatmap::from_str(&osu_content).map_err(|e| format!("Failed to parse beatmap: {}", e))?;

    // Calculate NPS
    let (nps_graph, drain_time) = calculate_nps_graph(&parsed_beatmap);

    Ok(NpsData {
        nps_graph,
        drain_time,
    })
}
