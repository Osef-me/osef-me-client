use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RatingInfo {
    pub rating_type: String,
    pub rating_value: f64,
}

impl Default for RatingInfo {
    fn default() -> Self {
        Self {
            rating_type: "osu".to_string(),
            rating_value: 5.0,
        }
    }
}
