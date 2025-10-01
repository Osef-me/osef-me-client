use crate::models::react::{Beatmapset, BeatmapModifications, Rates};
use crate::beatmap::monitoring::{emit_beatmap_changed, CurrentBeatmapWithRates};
use crate::beatmap::serialization::serialize_beatmap;
use tauri::{AppHandle, Manager};

// Command to get the current beatmap from the global state
#[tauri::command]
pub async fn get_current_beatmap(
    app_handle: AppHandle,
) -> Result<Option<Beatmapset>, String> {
    // Récupérer le CurrentBeatmapWithRates depuis le state de l'app
    let current_beatmap = app_handle.state::<CurrentBeatmapWithRates>();
    let beatmap_with_rates = current_beatmap.lock().await;

    // Sérialiser le BeatmapInfo en Beatmapset pour le frontend
    Ok(beatmap_with_rates.as_ref().map(|bwr| serialize_beatmap(&bwr.beatmap_info, "Songs/")))
}

// Command to get all rates for the current beatmap
#[tauri::command]
pub async fn get_all_rates(
    app_handle: AppHandle,
) -> Result<Vec<Rates>, String> {
    // Récupérer les rates calculés depuis le state
    let current_beatmap = app_handle.state::<CurrentBeatmapWithRates>();
    let beatmap_with_rates = current_beatmap.lock().await;

    Ok(beatmap_with_rates.as_ref().map(|bwr| bwr.rates.clone()).unwrap_or_default())
}

// Command to apply modifications to a beatmap and create a copy
#[tauri::command]
pub async fn apply_beatmap_modifications(
    _beatmap_osu_id: i32,
    modifications: BeatmapModifications,
) -> Result<Beatmapset, String> {
    // TODO: Implémenter la logique pour créer une copie modifiée de la beatmap
    // Pour l'instant, retourne un beatmapset de test
    let modified_beatmap = Beatmapset::default();

    // Appliquer les modifications (simulées)
    println!("Applying modifications: {:?}", modifications);

    Ok(modified_beatmap)
}

// Demo command to emit a beatmap with an incremented counter
#[tauri::command]
pub async fn emit_demo_beatmap(app_handle: AppHandle, counter: u32) -> Result<(), String> {
    // Générer une beatmap de démo basée sur le compteur
    let mut beatmap = Beatmapset::default();

    beatmap.artist = format!("Demo Artist {}", counter);
    beatmap.title = format!("Demo Song {}", counter);
    beatmap.creator = format!("Demo Mapper {}", counter);
    beatmap.osu_id = Some(100000 + counter as i32);

    // Modifier les noms des difficultés
    for (i, beatmap_info) in beatmap.beatmaps.iter_mut().enumerate() {
        beatmap_info.name = format!("Diff {} - {}", counter, i + 1);
    }

    // Émettre l'événement via le module beatmap_update
    emit_beatmap_changed(&app_handle, beatmap);

    Ok(())
}


