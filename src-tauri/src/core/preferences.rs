use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConfig {
    pub songs_path: String,
    pub theme: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            songs_path: "Songs".to_string(),
            theme: "dark".to_string(),
        }
    }
}

fn get_config_path() -> PathBuf {
    let config_dir = dirs::config_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("osef-me");
    if !config_dir.exists() {
        let _ = fs::create_dir_all(&config_dir);
    }
    config_dir.join("config.toml")
}

pub fn load_config() -> AppConfig {
    let config_path = get_config_path();
    if config_path.exists() {
        if let Ok(contents) = fs::read_to_string(&config_path) {
            if let Ok(config) = toml::from_str::<AppConfig>(&contents) {
                return config;
            }
        }
    }
    AppConfig::default()
}

pub fn save_config(config: &AppConfig) -> Result<(), String> {
    let config_path = get_config_path();
    let toml_string = toml::to_string_pretty(config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;
    fs::write(&config_path, toml_string)
        .map_err(|e| format!("Failed to write config file: {}", e))?;
    Ok(())
}

pub fn get_songs_path() -> Result<String, String> {
    let config = load_config();
    Ok(config.songs_path)
}

pub fn set_songs_path(path: String) -> Result<(), String> {
    let mut config = load_config();
    config.songs_path = path;
    save_config(&config)
}

pub fn get_theme() -> Result<String, String> {
    let config = load_config();
    Ok(config.theme)
}

pub fn set_theme(theme: String) -> Result<(), String> {
    let mut config = load_config();
    config.theme = theme;
    save_config(&config)
}
