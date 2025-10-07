use crate::core::react::{Beatmapset, BeatmapInfo as BeatmapInfoModel};
use rosu_memory_lib::reader::beatmap::common::BeatmapInfo;
use std::fs;
use base64::{Engine as _, engine::general_purpose};

pub fn serialize_beatmap(beatmap_info: &BeatmapInfo, song_folder: &str) -> Beatmapset {
    let mut beatmap = Beatmapset::default();
    
    beatmap.title = beatmap_info.metadata.title_original.clone();
    beatmap.artist = beatmap_info.metadata.author.clone();
    beatmap.creator = beatmap_info.metadata.creator.clone();
    
    let cover_path = format!("{}/{}/{}", song_folder, beatmap_info.location.folder, beatmap_info.location.cover);
    beatmap.cover_url = fs::read(&cover_path)
        .ok()
        .map(|image_data| {
            let b64 = general_purpose::STANDARD.encode(&image_data);
            format!("data:image/jpeg;base64,{}", b64)
        });
    
    beatmap.beatmaps = vec![BeatmapInfoModel::default()];
    beatmap.beatmaps[0].beatmap_osu_id = beatmap_info.technical.id;
    beatmap.beatmaps[0].name = beatmap_info.metadata.difficulty.clone();
    beatmap.beatmaps[0].count_circles = beatmap_info.stats.object_count;
    beatmap.beatmaps[0].count_sliders = beatmap_info.stats.slider_count;
    beatmap.beatmaps[0].count_spinners = 0;
    beatmap.beatmaps[0].od = beatmap_info.stats.od as f64;
    beatmap.beatmaps[0].hp = beatmap_info.stats.hp as f64;
    beatmap.beatmaps[0].ratings = vec![]; // Les ratings sont ajoutés après le calcul
    
    beatmap
}
