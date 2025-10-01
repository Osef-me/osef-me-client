use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BeatmapModifications {
    pub rate: f32,
    pub od: Option<f32>,
    pub hp: Option<f32>,
    pub ar: Option<f32>,
    pub cs: Option<f32>,
}
