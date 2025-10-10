use crate::core::beatmap::detection::detect_current_beatmap;
use crate::core::beatmap::serialization::serialize_beatmap;
use crate::core::calc::etterna::process_beatmap;
use crate::core::calc::nps::calculate_nps_graph;
use crate::core::internal::BeatmapWithRates;
use crate::core::preferences;
use crate::core::react::{NpsData, Rates};
use minacalc_rs::Calc;
use rosu_mem::process::Process;
use rosu_memory_lib::reader::beatmap::common::BeatmapInfo;
use rosu_memory_lib::reader::structs::State;
use rosu_memory_lib::Error;
use std::sync::Arc;
use tauri::{AppHandle, Emitter};
use tokio::sync::Mutex; // load songs path from config

use crate::core::internal::CurrentBeatmapData;

pub type CurrentBeatmapWithRates = Arc<Mutex<CurrentBeatmapData>>;

pub fn emit_beatmap_changed(app_handle: &AppHandle, beatmapset: crate::core::react::Beatmapset) {
    match app_handle.emit("beatmap-changed", beatmapset.clone()) {
        Ok(_) => {}
        Err(e) => {
            eprintln!("Failed to emit beatmap: {}", e);
        }
    }
}

pub fn emit_rates_calculated(app_handle: &AppHandle, rates: &Vec<Rates>) {
    println!("📤 Emitting rates-calculated: {} rates", rates.len());
    match app_handle.emit("rates-calculated", rates.clone()) {
        Ok(_) => {
            println!("✅ rates-calculated emitted");
        }
        Err(e) => {
            eprintln!("Failed to emit rates: {}", e);
        }
    }
}

pub fn emit_nps_calculated(app_handle: &AppHandle, nps_data: &NpsData) {
    println!(
        "📤 Emitting nps-calculated: {} points, drain_time={}s",
        nps_data.nps_graph.len(),
        nps_data.drain_time
    );
    println!("🧮 NPS data: {:?}", nps_data);
    match app_handle.emit("nps-calculated", nps_data.clone()) {
        Ok(_) => {
            println!("✅ nps-calculated emitted");
        }
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
    // Use configured songs path from preferences
    let songs_path = preferences::load_config().songs_path;
    let beatmapset = serialize_beatmap(&beatmap_info, &songs_path);
    emit_beatmap_changed(app_handle, beatmapset);

    let current_beatmap_clone = current_beatmap.clone();
    let app_handle_clone = app_handle.clone();

    let osu_path = format!(
        "{}/{}/{}",
        songs_path, beatmap_info.location.folder, beatmap_info.location.filename
    );
    println!("🧮 Processing beatmap for rates & NPS: {}", osu_path);
    let result = process_beatmap(
        &calc,
        &osu_path,
        beatmap_info.stats.length as f64,
        beatmap_info.stats.length as f64,
    )
    .await
    .map_err(|e| eprintln!("Failed to calculate rates: {}", e));

    if let Ok((rates, parsed_beatmap)) = result {
        println!("✅ Rates calculated: {} entries", rates.len());
        let (nps_graph, drain_time) = calculate_nps_graph(&parsed_beatmap);
        println!(
            "✅ NPS calculated: {} points, drain_time={}s",
            nps_graph.len(),
            drain_time
        );
        let nps_data = NpsData {
            nps_graph,
            drain_time,
        };

        emit_rates_calculated(&app_handle_clone, &rates);
        emit_nps_calculated(&app_handle_clone, &nps_data);

        let mut current = current_beatmap_clone.lock().await;
        current.beatmap_info = Some(beatmap_info);
        current.rates = rates;
        current.nps_data = Some(nps_data);
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
        // Monitor loop tick
        // println!("🔁 Monitoring tick");
        if let Ok(current_hash) =
            rosu_memory_lib::reader::beatmap::stable::memory::md5(process, state)
        {
            if last_hash.as_ref() != Some(&current_hash) {
                println!("🎯 Beatmap hash changed, detecting beatmap...");
                let detection_result = detect_current_beatmap(process, state);
                if let Ok(beatmap_info) = detection_result {
                    println!(
                        "🎼 Detected beatmap: folder='{}' file='{}'",
                        beatmap_info.location.folder, beatmap_info.location.filename
                    );
                    process_detected_beatmap(
                        &app_handle,
                        current_beatmap.clone(),
                        &calc,
                        beatmap_info,
                    )
                    .await;
                } else if let Err(e) = detection_result {
                    eprintln!("⚠️  Error detecting beatmap: {}", e);
                }

                last_hash = Some(current_hash);
            }
        }

        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
    }
}
