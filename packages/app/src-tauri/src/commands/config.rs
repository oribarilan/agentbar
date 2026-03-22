//! Tauri IPC commands for app configuration.

use tauri::{AppHandle, State};

use crate::config::{AgentbarConfig, AppConfig};
use crate::hotkey;

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn get_config(config: State<'_, AppConfig>) -> AgentbarConfig {
    config.get()
}

#[tauri::command]
pub fn get_default_config() -> AgentbarConfig {
    AgentbarConfig::default()
}

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn update_config(
    app: AppHandle,
    config: State<'_, AppConfig>,
    new_config: AgentbarConfig,
) -> Result<(), String> {
    let current = config.get();
    let hotkey_changed = current.general.hotkey != new_config.general.hotkey;

    if hotkey_changed {
        hotkey::replace_main_hotkey(&app, &current.general.hotkey, &new_config.general.hotkey)?;
    }

    config.update(new_config).map_err(|e| e.to_string())?;

    Ok(())
}
