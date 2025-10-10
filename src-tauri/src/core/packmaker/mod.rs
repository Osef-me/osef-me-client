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


