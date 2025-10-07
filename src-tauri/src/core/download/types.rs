use lazy_static::lazy_static;
use serde::Serialize;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tokio::sync::Semaphore;

pub type DownloadManager = Arc<Mutex<HashMap<i32, DownloadStatus>>>;

#[derive(Clone, Serialize)]
pub struct DownloadStatus {
    pub beatmapset_id: i32,
    pub filename: String,
    pub display_name: String,
    pub status: DownloadState,
    pub progress: f32,
    pub error: Option<String>,
    pub downloaded_bytes: u64,
    pub total_bytes: Option<u64>,
}

#[derive(Clone, Serialize, Debug)]
pub enum DownloadState {
    Queued,
    Downloading,
    Completed,
    Failed,
}

impl std::fmt::Display for DownloadState {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DownloadState::Queued => write!(f, "Queued"),
            DownloadState::Downloading => write!(f, "Downloading"),
            DownloadState::Completed => write!(f, "Completed"),
            DownloadState::Failed => write!(f, "Failed"),
        }
    }
}

lazy_static! {
    pub static ref DOWNLOAD_MANAGER: DownloadManager = Arc::new(Mutex::new(HashMap::new()));
    pub static ref DOWNLOAD_SEMAPHORE: Semaphore = Semaphore::new(5);
}

