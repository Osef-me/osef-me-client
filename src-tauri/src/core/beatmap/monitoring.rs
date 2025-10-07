use crate::core::internal::BeatmapWithRates;
use crate::core::react::{Rates, NpsData};
use crate::core::beatmap::detection::detect_current_beatmap;
use crate::core::beatmap::serialization::serialize_beatmap;
use crate::core::calc::nps::calculate_nps_graph;
use tauri::{AppHandle, Emitter};
use rosu_mem::process::Process;
use rosu_memory_lib::reader::structs::State;
use rosu_memory_lib::Error;
    use rosu_memory_lib::reader::beatmap::common::BeatmapInfo;
use std::sync::Arc;
use tokio::sync::Mutex;
use crate::core::calc::etterna::process_beatmap;
use minacalc_rs::Calc;

pub type CurrentBeatmapWithRates = Arc<Mutex<Option<BeatmapWithRates>>>;

pub fn emit_beatmap_changed(app_handle: &AppHandle, beatmapset: crate::core::react::Beatmapset) {
    match app_handle.emit("beatmap-changed", beatmapset.clone()) {
        Ok(_) => {}
        Err(e) => {
            eprintln!("Failed to emit beatmap: {}", e);
        }
    }
}

pub fn emit_rates_calculated(app_handle: &AppHandle, rates: &Vec<Rates>) {
    match app_handle.emit("rates-calculated", rates.clone()) {
        Ok(_) => {}
        Err(e) => {
            eprintln!("Failed to emit rates: {}", e);
        }
    }
}

pub fn emit_nps_calculated(app_handle: &AppHandle, nps_data: &NpsData) {
    match app_handle.emit("nps-calculated", nps_data.clone()) {
        Ok(_) => {}
        Err(e) => {
            eprintln!("Failed to emit NPS data: {}", e);
        }
    }
}

async fn process_detected_beatmap(
    app_handle: &AppHandle,
    current_beatmap: CurrentBeatmapWithRates,
    calc: &Calc,
    beatmap_info: BeatmapInfo,
) {
    // Émettre immédiatement la beatmap sans ratings (pour affichage rapide)
    let beatmapset = serialize_beatmap(&beatmap_info, "F:/Osu!Fx/Songs/");
    emit_beatmap_changed(app_handle, beatmapset);

    let current_beatmap_clone = current_beatmap.clone();
    let app_handle_clone = app_handle.clone();

    let osu_path = format!(
        "F:/Osu!Fx/Songs/{}/{}",
        beatmap_info.location.folder, beatmap_info.location.filename
    );
    let result = process_beatmap(&calc, &osu_path, beatmap_info.stats.length as f64, beatmap_info.stats.length as f64, 180.0 as f32)
        .await
        .map_err(|e| eprintln!("Failed to calculate rates: {}", e));

                        if let Ok((rates, parsed_beatmap)) = result {
                            let (nps_graph, drain_time) = calculate_nps_graph(&parsed_beatmap);
                            let nps_data = NpsData { nps_graph, drain_time };

                            emit_rates_calculated(&app_handle_clone, &rates);
                            emit_nps_calculated(&app_handle_clone, &nps_data);

        let mut current = current_beatmap_clone.lock().await;
        *current = Some(BeatmapWithRates { beatmap_info, rates });
    }
}

pub async fn beatmap_monitoring_loop(
    app_handle: AppHandle,
    current_beatmap: CurrentBeatmapWithRates,
    state: &mut State,
    process: &Process,
    calc: &Calc,
) -> Result<(), Error> {
    
    
    let mut last_hash: Option<String> = None;
    
    loop {
        if let Ok(current_hash) = rosu_memory_lib::reader::beatmap::stable::memory::md5(process, state) {
            if last_hash.as_ref() != Some(&current_hash) {
                
                
                let detection_result = detect_current_beatmap(process, state);
                if let Ok(beatmap_info) = detection_result {
                    process_detected_beatmap(&app_handle, current_beatmap.clone(), &calc, beatmap_info).await;
                } else if let Err(e) = detection_result {
                    eprintln!("⚠️  Error detecting beatmap: {}", e);
                }
                
                last_hash = Some(current_hash);
            }
        }
        
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
    }
}
