//! Tauri IPC commands for window operations.

use tauri::AppHandle;

use crate::window;

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn toggle_window(app: AppHandle) -> Result<(), String> {
    window::toggle(&app)
}

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn show_window(app: AppHandle) -> Result<(), String> {
    window::show(&app)
}

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn hide_window(app: AppHandle) -> Result<(), String> {
    window::hide(&app)
}

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn open_settings(app: AppHandle) -> Result<(), String> {
    window::open_settings(&app)
}
