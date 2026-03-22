//! Window management helpers for launcher and settings windows.

use tauri::utils::config::Color;
use tauri::{AppHandle, Manager, WebviewUrl};

use crate::error::StringResult;
use crate::focus;

const MAIN_WINDOW_LABEL: &str = "main";
const SETTINGS_WINDOW_LABEL: &str = "settings";

pub fn toggle(app: &AppHandle) -> Result<(), String> {
    let win = get_main_window(app)?;

    if win.is_visible().str_err()? {
        win.hide().str_err()?;
        focus::restore_previous_app();
        Ok(())
    } else {
        focus::capture_frontmost_app();
        win.center().str_err()?;
        win.show().str_err()?;
        win.set_focus().str_err()
    }
}

pub fn show(app: &AppHandle) -> Result<(), String> {
    focus::capture_frontmost_app();
    let win = get_main_window(app)?;
    win.center().str_err()?;
    win.show().str_err()?;
    win.set_focus().str_err()
}

pub fn hide(app: &AppHandle) -> Result<(), String> {
    let win = get_main_window(app)?;
    win.hide().str_err()?;
    focus::restore_previous_app();
    Ok(())
}

fn get_main_window(app: &AppHandle) -> Result<tauri::WebviewWindow, String> {
    app.get_webview_window(MAIN_WINDOW_LABEL)
        .ok_or_else(|| format!("window '{MAIN_WINDOW_LABEL}' not found"))
}

pub fn open_settings(app: &AppHandle) -> Result<(), String> {
    if let Ok(main) = get_main_window(app) {
        let _ = main.hide();
    }

    if let Some(win) = app.get_webview_window(SETTINGS_WINDOW_LABEL) {
        win.show().str_err()?;
        win.set_focus().str_err()?;
        return Ok(());
    }

    let url = WebviewUrl::App("index.html?page=settings".into());
    let bg = Color(11, 9, 7, 255);

    tauri::WebviewWindowBuilder::new(app, SETTINGS_WINDOW_LABEL, url)
        .title("Agentbar Settings")
        .inner_size(740.0, 510.0)
        .resizable(false)
        .visible(false)
        .background_color(bg)
        .center()
        .build()
        .str_err()?;

    Ok(())
}
