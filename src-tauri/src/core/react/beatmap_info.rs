use serde::{Deserialize, Serialize};
use super::rating_info::RatingInfo;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BeatmapInfo {
    pub beatmap_osu_id: i32,
    pub name: String,
    pub count_circles: i32,
    pub count_sliders: i32,
    pub count_spinners: i32,
    pub od: f64,
    pub hp: f64,
    pub ratings: Vec<RatingInfo>,
}

impl Default for BeatmapInfo {
    fn default() -> Self {
        Self {
            beatmap_osu_id: 123456,
            name: "Test Difficulty".to_string(),
            count_circles: 100,
            count_sliders: 50,
            count_spinners: 5,
            od: 8.0,
            hp: 7.5,
            ratings: vec![],
        }
    }
}
