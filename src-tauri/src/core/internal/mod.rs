use crate::core::react::{NpsData, Rates};
use rosu_memory_lib::reader::beatmap::common::BeatmapInfo;

#[derive(Debug, Clone)]
pub struct BeatmapWithRates {
    pub beatmap_info: BeatmapInfo,
    pub rates: Vec<Rates>,
}

impl BeatmapWithRates {
    pub fn new(beatmap_info: BeatmapInfo) -> Self {
        Self {
            beatmap_info,
            rates: Vec::new(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct CurrentBeatmapData {
    pub beatmap_info: Option<BeatmapInfo>,
    pub rates: Vec<Rates>,
    pub nps_data: Option<NpsData>,
}
