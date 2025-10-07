use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NpsData {
    pub nps_graph: Vec<f64>,
    pub drain_time: f64,
}

