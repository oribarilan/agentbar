//! Global hotkey registration helpers.

use tauri::AppHandle;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};

use crate::error::StringResult;
use crate::window;

/// Register the main launcher hotkey.
pub fn register_main_hotkey(app: &AppHandle, hotkey: &str) -> Result<(), String> {
    app.global_shortcut()
        .on_shortcut(hotkey, |app, _, event| {
            if event.state == ShortcutState::Pressed {
                let _ = window::toggle(app);
            }
        })
        .str_err()
}

/// Replace a previously registered launcher hotkey.
pub fn replace_main_hotkey(
    app: &AppHandle,
    old_hotkey: &str,
    new_hotkey: &str,
) -> Result<(), String> {
    if app.global_shortcut().is_registered(old_hotkey) {
        app.global_shortcut().unregister(old_hotkey).str_err()?;
    }

    register_main_hotkey(app, new_hotkey)
}
