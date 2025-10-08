pub mod detection;
pub mod monitoring;
pub mod serialization;

use std::str::FromStr;

use crate::core::react::{BeatmapModifications, Beatmapset, NpsData, Rates};
use monitoring::{emit_beatmap_changed, CurrentBeatmapWithRates};
use serialization::serialize_beatmap;
use tauri::{AppHandle, Manager};
use crate::core::edit::ln::ln::{full_ln, full_ln_beat_divisor};
use crate::core::edit::ln::noln::noln;
use crate::core::edit::rates::rates::rate;

/// Return the current Beatmapset from state, if any
pub async fn get_current_beatmap_from_state(app_handle: &AppHandle) -> Option<Beatmapset> {
    let current_beatmap = app_handle.state::<CurrentBeatmapWithRates>();
    let current_data = current_beatmap.lock().await;
    current_data.beatmap_info.clone()
        .as_ref()
        .map(|bwr| serialize_beatmap(&bwr, "Songs/"))
}

/// Return all rates for the current beatmap from state
pub async fn get_all_rates_from_state(app_handle: &AppHandle) -> Vec<Rates> {
    let current_beatmap = app_handle.state::<CurrentBeatmapWithRates>();
    let current_data = current_beatmap.lock().await;
    current_data.rates.clone()
}

/// Return NPS data for the current beatmap from state
pub async fn get_current_nps_data(app_handle: &AppHandle) -> Option<NpsData> {
    let current_beatmap = app_handle.state::<CurrentBeatmapWithRates>();
    let current_data = current_beatmap.lock().await;
    current_data.nps_data.clone()
}

/// Return all current beatmap data (beatmap info, rates, and NPS)
pub async fn get_current_beatmap_data(app_handle: &AppHandle) -> crate::core::internal::CurrentBeatmapData {
    let current_beatmap = app_handle.state::<CurrentBeatmapWithRates>();
    let current_data = current_beatmap.lock().await;
    current_data.clone()
}

/// Apply modifications to a beatmap
pub async fn apply_beatmap_modifications_core(
    app_handle: &AppHandle,
    modifications: BeatmapModifications,
) -> Result<Beatmapset, String> {
    use std::fs;
    use rosu_map::Beatmap as RmBeatmap;
    use crate::core::preferences;

    // Get current beatmap from state
    let current_beatmap = app_handle.state::<CurrentBeatmapWithRates>();
    let current_data = current_beatmap.lock().await;

    let beatmap_info = match &current_data.beatmap_info {
        Some(info) => info,
        None => return Err("No current beatmap loaded".to_string()),
    };

    // Build the full path to the .osu file
    let songs_path = preferences::load_config().songs_path;
    let osu_path = format!(
        "{}/{}/{}",
        songs_path, beatmap_info.location.folder, beatmap_info.location.filename
    );

    println!("🔧 Applying modifications to beatmap: {}", osu_path);
    println!("📋 Modifications to apply: OD={:?}, HP={:?}", modifications.od, modifications.hp);

    // Validate that the file exists before attempting to read it
    if !std::path::Path::new(&osu_path).exists() {
        return Err(format!("Beatmap file does not exist: {}", osu_path));
    }

    // Read the .osu file content
    let osu_content = fs::read_to_string(&osu_path)
        .map_err(|e| format!("Failed to read beatmap file '{}': {}", osu_path, e))?;

    // Parse the beatmap
    let mut beatmap = RmBeatmap::from_str(&osu_content)
        .map_err(|e| format!("Failed to parse beatmap '{}': {}", osu_path, e))?;

    // Apply modifications if provided
    let mut modifications_applied = Vec::new();

    // Store original values to check if modifications are actually needed
    let original_od = beatmap.overall_difficulty;
    let original_hp = beatmap.hp_drain_rate;

    if let Some(od) = modifications.od {
        // Skip processing if OD value is the same
        if (od - original_od).abs() > f32::EPSILON {
            beatmap.overall_difficulty = od;
            beatmap.version = format!("{} OD{}", beatmap.version, od.to_string());
            modifications_applied.push(format!("OD{}", od.to_string().replace('.', "_")));
        }
    }

    if let Some(hp) = modifications.hp {
        // Skip processing if HP value is the same
        if (hp - original_hp).abs() > f32::EPSILON {
            beatmap.hp_drain_rate = hp;
            beatmap.version = format!("{} HP{}", beatmap.version, hp.to_string());
            modifications_applied.push(format!("HP{}", hp.to_string().replace('.', "_")));
        }
    }

    // Apply rate modifications
    if let Some(target_rate) = modifications.target_rate {
        // Skip processing if rate is 1.0 (no change needed)
        if (target_rate - 1.0).abs() > f32::EPSILON {
            rate(target_rate as f64, &mut beatmap);
            let rate_suffix = format!("x{}", target_rate.to_string());
            beatmap.version = format!("{} {}", beatmap.version, rate_suffix);
            modifications_applied.push(format!("Rate{}", target_rate.to_string().replace('.', "_")));
        }
    }

    // Apply LN modifications
    println!("🔧 Applying LN modifications: {:?}", modifications.ln_mode);
    if let Some(ln_mode) = &modifications.ln_mode {
        match ln_mode.as_str() {
            "fullln" => {
                if let (Some(gap_ms), Some(min_distance)) = (modifications.ln_gap_ms, modifications.ln_min_distance_ms) {
                    full_ln(&mut beatmap, gap_ms as f64, min_distance as f64);

                    beatmap.version = format!("{} {} {} {}", beatmap.version, "FullLN", gap_ms.to_string(), min_distance.to_string());
                    modifications_applied.push("FullLN".to_string());
                }
            },
            "noln" => {
                noln(&mut beatmap);

                beatmap.version = format!("{} {}", beatmap.version, "NoLN");
                modifications_applied.push("NoLN".to_string());
            },
            _ => {}
        }
    }

    if modifications_applied.is_empty() {
        return Err("No modifications to apply".to_string());
    }

    // Generate new filename with modifications
    let original_filename = &beatmap_info.location.filename;

    // Find the .osu extension (should be the last . in the filename)
    let osu_extension = ".osu";
    let extension_pos = if let Some(pos) = original_filename.to_lowercase().rfind(osu_extension) {
        pos
    } else {
        return Err(format!("Invalid beatmap filename (no .osu extension): {}", original_filename));
    };

    let name_without_ext = &original_filename[..extension_pos];
    let modifications_str = modifications_applied.join("_");
    let mut new_filename = format!("{}_{}.osu", name_without_ext, modifications_str);

    // Sanitize filename for Windows compatibility
    // Replace problematic characters with underscores
    new_filename = new_filename.replace(':', "_");
    new_filename = new_filename.replace('<', "_");
    new_filename = new_filename.replace('>', "_");
    new_filename = new_filename.replace('"', "_");
    new_filename = new_filename.replace('|', "_");
    new_filename = new_filename.replace('?', "_");
    new_filename = new_filename.replace('*', "_");

    println!("📝 Generated new filename: {}", new_filename);

    // Create the modified .osu content
    let modified_content = beatmap.encode_to_string()
        .map_err(|e| format!("Failed to encode modified beatmap: {}", e))?;

    // Save the modified beatmap
    let new_path = format!("{}/{}/{}", songs_path, beatmap_info.location.folder, new_filename);
    println!("📁 Will save to: {}", new_path);

    // Ensure the directory exists
    let dir_path = std::path::Path::new(&new_path).parent()
        .ok_or_else(|| format!("Invalid directory path for: {}", new_path))?;

    if !dir_path.exists() {
        return Err(format!("Beatmap directory does not exist: {}", dir_path.display()));
    }

    fs::write(&new_path, modified_content)
        .map_err(|e| format!("Failed to save modified beatmap '{}': {}", new_path, e))?;

    println!("✅ Modified beatmap saved as: {}", new_path);

    // Return the modified beatmap info
    let mut modified_beatmapset = serialize_beatmap(beatmap_info, &songs_path);
    // Note: We don't update the filename in the response since it's just for display
    // The actual file has been saved with the new name

    Ok(modified_beatmapset)
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
