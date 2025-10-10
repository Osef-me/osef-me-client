use std::sync::Arc;
use tokio::sync::Mutex;

use crate::core::react::Beatmapset;
use crate::core::internal::CurrentBeatmapData;
use crate::core::beatmap::serialization::serialize_beatmap;
use crate::core::preferences;
use std::fs;
use std::str::FromStr;
use rosu_map::Beatmap as RmBeatmap;
    
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, Default)]
pub struct PackMetadata {
    pub name: String,
    pub author: String,
    pub creator: String,
}

#[derive(Debug, Clone)]
pub struct BeatmapData {
    pub beatmap: Beatmapset,
    pub rm_beatmap: Option<RmBeatmap>,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct PublicBeatmapData {
    pub beatmap: Beatmapset,
}

#[derive(Debug, Default)]
pub struct PackMaker {
    pub metadata: PackMetadata,
    pub beatmaps: Vec<BeatmapData>,
}

pub type SharedPackMaker = Arc<Mutex<PackMaker>>;

impl PackMaker {
    pub fn new() -> Self {
        Self { metadata: PackMetadata::default(), beatmaps: Vec::new() }
    }
}

pub async fn add_current_to_pack(
    pack: &SharedPackMaker,
    current: &tokio::sync::MutexGuard<'_, CurrentBeatmapData>,
) -> Result<(), String> {
    let beatmap_info = current
        .beatmap_info
        .clone()
        .ok_or_else(|| "No current beatmap".to_string())?;
    // Load songs path from preferences
    let songs_path = preferences::load_config().songs_path;
    // Build full osu file path
    let osu_path = format!(
        "{}/{}/{}",
        songs_path, beatmap_info.location.folder, beatmap_info.location.filename
    );
    // Load and parse the .osu file similar to calc
    let osu_map_string = fs::read_to_string(&osu_path)
        .map_err(|e| format!("Failed to read osu file: {}", e))?;
    let parsed = RmBeatmap::from_str(&osu_map_string)
        .map_err(|e| format!("Failed to parse osu file: {}", e))?;
    let beatmapset: Beatmapset = serialize_beatmap(&beatmap_info, &songs_path);
    let mut guard = pack.lock().await;
    guard.beatmaps.push(BeatmapData { beatmap: beatmapset, rm_beatmap: Some(parsed) });
    Ok(())
}

pub async fn get_public_pack(pack: &SharedPackMaker) -> (PackMetadata, Vec<PublicBeatmapData>) {
    let guard = pack.lock().await;
    let meta = guard.metadata.clone();
    let list = guard
        .beatmaps
        .iter()
        .map(|b| PublicBeatmapData { beatmap: b.beatmap.clone() })
        .collect::<Vec<_>>();
    (meta, list)
}

pub async fn update_pack_beatmap_version(
    pack: &SharedPackMaker,
    index: usize,
    new_version: String,
) -> Result<(), String> {
    let mut guard = pack.lock().await;
    let item = guard
        .beatmaps
        .get_mut(index)
        .ok_or_else(|| "Invalid beatmap index".to_string())?;

    // Update rm_beatmap by editing the version field
    if let Some(ref mut rm) = item.rm_beatmap {
        // Encode, replace Version: line, and re-parse to ensure consistency
        let osu_text = rm
            .encode_to_string()
            .map_err(|e| format!("Failed to encode beatmap: {}", e))?;
        // Replace Version: ... line (difficulty name)
        let replaced = replace_version_line(&osu_text, &new_version);
        let reparsed = RmBeatmap::from_str(&replaced)
            .map_err(|e| format!("Failed to reparse beatmap after version update: {}", e))?;
        *rm = reparsed;
        // Update the display Beatmapset difficulty name too
        if let Some(first) = item.beatmap.beatmaps.get_mut(0) {
            first.name = new_version.clone();
        }
    } else {
        return Err("No rm_beatmap stored for this item".to_string());
    }

    Ok(())
}

fn replace_version_line(osu_text: &str, new_version: &str) -> String {
    let mut out = String::with_capacity(osu_text.len() + 16);
    for line in osu_text.lines() {
        if line.starts_with("Version:") {
            out.push_str("Version:");
            out.push(' ');
            out.push_str(new_version);
            out.push('\n');
        } else {
            out.push_str(line);
            out.push('\n');
        }
    }
    out
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct PackBeatmapModifications {
    pub od: Option<f32>,
    pub hp: Option<f32>,
    pub target_rate: Option<f32>,
    pub ln_mode: Option<String>,
    pub ln_gap_ms: Option<f32>,
    pub ln_min_distance_ms: Option<f32>,
    pub version_name: Option<String>,
}

pub async fn update_pack_beatmap(
    pack: &SharedPackMaker,
    index: usize,
    modifications: PackBeatmapModifications,
) -> Result<(), String> {
    use crate::core::edit::rates::rates::rate;
    use crate::core::edit::ln::ln::full_ln;
    use crate::core::edit::ln::noln::noln;
    use std::str::FromStr;

    let mut guard = pack.lock().await;
    let item = guard
        .beatmaps
        .get_mut(index)
        .ok_or_else(|| "Invalid beatmap index".to_string())?;

    let rm = item
        .rm_beatmap
        .as_mut()
        .ok_or_else(|| "No rm_beatmap stored for this item".to_string())?;

    // Encode to text to allow version name replacement; keep a working copy
    let mut osu_text = rm
        .encode_to_string()
        .map_err(|e| format!("Failed to encode beatmap: {}", e))?;

    // Apply OD
    if let Some(od) = modifications.od {
        if (rm.overall_difficulty - od).abs() > f32::EPSILON {
            rm.overall_difficulty = od;
        }
        if let Some(first) = item.beatmap.beatmaps.get_mut(0) {
            first.od = od as f64;
        }
    }

    // Apply HP
    if let Some(hp) = modifications.hp {
        if (rm.hp_drain_rate - hp).abs() > f32::EPSILON {
            rm.hp_drain_rate = hp;
        }
        if let Some(first) = item.beatmap.beatmaps.get_mut(0) {
            first.hp = hp as f64;
        }
    }

    // Apply rate
    if let Some(target_rate) = modifications.target_rate {
        if (target_rate - 1.0).abs() > f32::EPSILON {
            rate(target_rate as f64, rm);
        }
    }

    // Apply LN modifications
    if let Some(ln_mode) = &modifications.ln_mode {
        match ln_mode.as_str() {
            "fullln" => {
                if let (Some(gap_ms), Some(min_distance)) = (modifications.ln_gap_ms, modifications.ln_min_distance_ms) {
                    full_ln(rm, gap_ms as f64, min_distance as f64);
                }
            }
            "noln" => {
                noln(rm);
            }
            _ => {}
        }
    }

    // Version name replacement (difficulty name)
    if let Some(name) = modifications.version_name {
        osu_text = replace_version_line(&osu_text, &name);
        *rm = RmBeatmap::from_str(&osu_text)
            .map_err(|e| format!("Failed to reparse beatmap after version update: {}", e))?;
        if let Some(first) = item.beatmap.beatmaps.get_mut(0) {
            first.name = name;
        }
    }

    Ok(())
}


