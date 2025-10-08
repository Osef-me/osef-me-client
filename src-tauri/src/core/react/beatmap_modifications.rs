use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BeatmapModifications {
    pub od: Option<f32>,
    pub hp: Option<f32>,
    pub target_rate: Option<f32>,
    pub ln_mode: Option<String>,
    pub ln_gap_ms: Option<f32>,
    pub ln_min_distance_ms: Option<f32>,
}
