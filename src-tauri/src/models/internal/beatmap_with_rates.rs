use crate::models::react::Rates;
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
