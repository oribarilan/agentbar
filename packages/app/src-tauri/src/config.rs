//! Application configuration persisted as TOML.

use std::path::PathBuf;
use std::sync::{Arc, RwLock};

use serde::{Deserialize, Serialize};
use thiserror::Error;

/// Full application configuration.
#[derive(Debug, Default, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(default)]
pub struct AgentbarConfig {
    pub general: GeneralConfig,
    pub appearance: AppearanceConfig,
}

/// General application settings.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(default)]
pub struct GeneralConfig {
    pub hotkey: String,
    pub launch_at_login: bool,
}

/// Appearance settings.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(default)]
pub struct AppearanceConfig {
    pub theme: String,
    pub font_size: String,
}

impl Default for GeneralConfig {
    fn default() -> Self {
        Self {
            hotkey: "CmdOrCtrl+Shift+Space".to_owned(),
            launch_at_login: false,
        }
    }
}

impl Default for AppearanceConfig {
    fn default() -> Self {
        Self {
            theme: "agentbar".to_owned(),
            font_size: "small".to_owned(),
        }
    }
}

/// Managed app config state.
#[derive(Clone)]
pub struct AppConfig(Arc<RwLock<AgentbarConfig>>);

impl AppConfig {
    pub fn new(config: AgentbarConfig) -> Self {
        Self(Arc::new(RwLock::new(config)))
    }

    pub fn get(&self) -> AgentbarConfig {
        self.0.read().expect("config lock poisoned").clone()
    }

    pub fn update(&self, new_config: AgentbarConfig) -> Result<(), ConfigError> {
        save_to_disk(&new_config)?;
        *self.0.write().expect("config lock poisoned") = new_config;
        Ok(())
    }
}

#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("failed to persist config: {0}")]
    Write(String),
}

fn config_path() -> PathBuf {
    config_base_dir().join("agentbar").join("config.toml")
}

fn config_base_dir() -> PathBuf {
    #[cfg(unix)]
    {
        std::env::var_os("XDG_CONFIG_HOME")
            .map(PathBuf::from)
            .or_else(|| dirs::home_dir().map(|h| h.join(".config")))
            .unwrap_or_else(|| PathBuf::from(".config"))
    }
    #[cfg(windows)]
    {
        dirs::config_dir().unwrap_or_else(|| PathBuf::from(".config"))
    }
}

pub fn load_or_default() -> AgentbarConfig {
    let path = config_path();
    let Ok(contents) = std::fs::read_to_string(&path) else {
        return AgentbarConfig::default();
    };

    toml::from_str(&contents).unwrap_or_else(|_| AgentbarConfig::default())
}

fn save_to_disk(config: &AgentbarConfig) -> Result<(), ConfigError> {
    let path = config_path();
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| ConfigError::Write(e.to_string()))?;
    }
    let toml_str = toml::to_string_pretty(config).map_err(|e| ConfigError::Write(e.to_string()))?;
    std::fs::write(&path, toml_str).map_err(|e| ConfigError::Write(e.to_string()))?;
    Ok(())
}
