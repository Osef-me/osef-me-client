use crate::core::preferences;

#[tauri::command]
pub fn get_songs_path() -> Result<String, String> {
    preferences::get_songs_path()
}

#[tauri::command]
pub fn set_songs_path(path: String) -> Result<(), String> {
    preferences::set_songs_path(path)
}

#[tauri::command]
pub fn get_theme() -> Result<String, String> {
    preferences::get_theme()
}

#[tauri::command]
pub fn set_theme(theme: String) -> Result<(), String> {
    preferences::set_theme(theme)
}


