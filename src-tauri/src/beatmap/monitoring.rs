use crate::models::internal::BeatmapWithRates;
use crate::models::react::{Rates, NpsData};
use crate::beatmap::detection::detect_current_beatmap;
use crate::beatmap::serialization::serialize_beatmap;
use crate::calc::nps::calculate_nps_graph;
use tauri::{AppHandle, Emitter};
use rosu_mem::process::Process;
use rosu_memory_lib::reader::structs::State;
use rosu_memory_lib::Error;
use std::sync::Arc;
use tokio::sync::Mutex;
use crate::calc::etterna::process_beatmap;
use minacalc_rs::Calc;

pub type CurrentBeatmapWithRates = Arc<Mutex<Option<BeatmapWithRates>>>;

pub fn emit_beatmap_changed(app_handle: &AppHandle, beatmapset: crate::models::react::Beatmapset) {
    match app_handle.emit("beatmap-changed", beatmapset.clone()) {
        Ok(_) => {
            println!(
                "✅ Beatmap émise: {} - {} (par {})",
                beatmapset.artist, beatmapset.title, beatmapset.creator
            );
        }
        Err(e) => {
            eprintln!("❌ Erreur lors de l'émission de la beatmap: {}", e);
        }
    }
}

pub fn emit_rates_calculated(app_handle: &AppHandle, rates: &Vec<Rates>) {
    match app_handle.emit("rates-calculated", rates.clone()) {
        Ok(_) => {
            println!("✅ Rates émis: {} rates de 0.7 à 2.0", rates.len());
        }
        Err(e) => {
            eprintln!("❌ Erreur lors de l'émission des rates: {}", e);
        }
    }
}

pub fn emit_nps_calculated(app_handle: &AppHandle, nps_data: &NpsData) {
    match app_handle.emit("nps-calculated", nps_data.clone()) {
        Ok(_) => {
            println!("✅ NPS émis: {} sections, drain_time={:.2}s", nps_data.nps_graph.len(), nps_data.drain_time);
        }
        Err(e) => {
            eprintln!("❌ Erreur lors de l'émission du NPS: {}", e);
        }
    }
}

pub async fn beatmap_monitoring_loop(
    app_handle: AppHandle,
    current_beatmap: CurrentBeatmapWithRates,
    state: &mut State,
    process: &Process,
    calc: &Calc,
) -> Result<(), Error> {
    println!("🎵 Starting beatmap monitoring loop...");
    
    let mut last_hash: Option<String> = None;
    
    loop {
        if let Ok(current_hash) = rosu_memory_lib::reader::beatmap::stable::memory::md5(process, state) {
            if last_hash.as_ref() != Some(&current_hash) {
                println!("🔄 Beatmap changed! New hash: {}", current_hash);
                
                match detect_current_beatmap(process, state) {
                    Ok(beatmap_info) => {
                        // Émettre immédiatement la beatmap sans ratings (pour affichage rapide)
                        let beatmapset = serialize_beatmap(&beatmap_info, "F:/Osu!Fx/Songs/");
                        emit_beatmap_changed(&app_handle, beatmapset);
                        
                        let beatmap_info_clone = beatmap_info.clone();
                        let current_beatmap_clone = current_beatmap.clone();
                        let app_handle_clone = app_handle.clone();
                        
                        let osu_path = format!("F:/Osu!Fx/Songs/{}/{}", beatmap_info.location.folder, beatmap_info.location.filename);
                        let result = process_beatmap(&calc,  &osu_path, beatmap_info.stats.length as f64, beatmap_info.stats.length as f64, 180.0 as f32).await.map_err(|e| eprintln!("❌ Erreur lors du calcul des rates: {}", e));
                
                        if let Ok((rates, parsed_beatmap)) = result {
                            println!("✅ {} rates calculés", rates.len());
                            
                            // Trouver le rate à 100
                            let (nps_graph, drain_time) = calculate_nps_graph(&parsed_beatmap);
                            let nps_data = NpsData {
                                nps_graph,
                                drain_time,
                            };
                            
                            emit_rates_calculated(&app_handle_clone, &rates);
                            emit_nps_calculated(&app_handle_clone, &nps_data);
                            
                            let mut current = current_beatmap_clone.lock().await;
                            *current = Some(BeatmapWithRates {
                                beatmap_info: beatmap_info,
                                rates,
                            });
                        }
                        
                    }
                    Err(e) => {
                        eprintln!("⚠️  Error detecting beatmap: {}", e);
                    }
                }
                
                last_hash = Some(current_hash);
            }
        }
        
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
    }
}
