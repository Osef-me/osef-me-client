use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Rates {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub osu_hash: Option<String>,
    pub centirate: i32,
    pub drain_time: f64,
    pub total_time: f64,
    pub bpm: f64,
    pub rating: Vec<Rating>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Rating {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rates_id: Option<i32>,
    pub rating: f64,
    pub rating_type: String,
    pub mode_rating: ModeRating,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ModeRating {
    Mania { Mania: ManiaRating },
    Std,
    Ctb,
    Taiko,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManiaRating {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<i32>,
    pub stream: f64,
    pub jumpstream: f64,
    pub handstream: f64,
    pub stamina: f64,
    pub jackspeed: f64,
    pub chordjack: f64,
    pub technical: f64,
}

impl Default for Rates {
    fn default() -> Self {
        Self {
            id: Some(1),
            osu_hash: Some("abc123".to_string()),
            centirate: 100,
            drain_time: 120.0,
            total_time: 180.0,
            bpm: 180.0,
            rating: vec![],
        }
    }
}
