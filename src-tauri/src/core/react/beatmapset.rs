use serde::{Deserialize, Serialize};
use super::beatmap_info::BeatmapInfo;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Beatmapset {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub osu_id: Option<i32>,
    pub artist: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub artist_unicode: Option<String>,
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title_unicode: Option<String>,
    pub creator: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
    pub has_video: bool,
    pub has_storyboard: bool,
    pub is_explicit: bool,
    pub is_featured: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cover_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub preview_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub osu_file_url: Option<String>,
    pub beatmaps: Vec<BeatmapInfo>,
}

impl Default for Beatmapset {
    fn default() -> Self {
        Self {
            id: None,
            osu_id: Some(123456),
            artist: "Test Artist".to_string(),
            artist_unicode: None,
            title: "Test Song".to_string(),
            title_unicode: None,
            creator: "Test Mapper".to_string(),
            source: None,
            tags: None,
            has_video: false,
            has_storyboard: false,
            is_explicit: false,
            is_featured: false,
            cover_url: None,
            preview_url: None,
            osu_file_url: None,
            beatmaps: vec![],
        }
    }
}
