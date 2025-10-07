pub mod monitoring;
pub mod detection;
pub mod serialization;

use crate::core::react::{Beatmapset, BeatmapModifications, Rates};
use monitoring::{emit_beatmap_changed, CurrentBeatmapWithRates};
use serialization::serialize_beatmap;
use tauri::{AppHandle, Manager};

/// Return the current Beatmapset from state, if any
pub async fn get_current_beatmap_from_state(app_handle: &AppHandle) -> Option<Beatmapset> {
    let current_beatmap = app_handle.state::<CurrentBeatmapWithRates>();
    let beatmap_with_rates = current_beatmap.lock().await;
    beatmap_with_rates
        .as_ref()
        .map(|bwr| serialize_beatmap(&bwr.beatmap_info, "Songs/"))
}

/// Return all rates for the current beatmap from state
pub async fn get_all_rates_from_state(app_handle: &AppHandle) -> Vec<Rates> {
    let current_beatmap = app_handle.state::<CurrentBeatmapWithRates>();
    let beatmap_with_rates = current_beatmap.lock().await;
    beatmap_with_rates
        .as_ref()
        .map(|bwr| bwr.rates.clone())
        .unwrap_or_default()
}

/// Apply modifications to a beatmap (placeholder logic)
pub fn apply_beatmap_modifications_core(
    _beatmap_osu_id: i32,
    _modifications: BeatmapModifications,
) -> Result<Beatmapset, String> {
    // TODO: implement real modification logic; for now return default
    Ok(Beatmapset::default())
}

/// Build a demo beatmap for a given counter
pub fn build_demo_beatmap(counter: u32) -> Beatmapset {
    let mut beatmap = Beatmapset::default();
    beatmap.artist = format!("Demo Artist {}", counter);
    beatmap.title = format!("Demo Song {}", counter);
    beatmap.creator = format!("Demo Mapper {}", counter);
    beatmap.osu_id = Some(100000 + counter as i32);
    for (i, beatmap_info) in beatmap.beatmaps.iter_mut().enumerate() {
        beatmap_info.name = format!("Diff {} - {}", counter, i + 1);
    }
    beatmap
}

/// Emit a demo beatmap event
pub fn emit_demo_beatmap_core(app_handle: &AppHandle, counter: u32) -> Result<(), String> {
    let beatmap = build_demo_beatmap(counter);
    emit_beatmap_changed(app_handle, beatmap);
    Ok(())
}