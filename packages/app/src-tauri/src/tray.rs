//! System tray setup and menu event handling.

use tauri::{
    image::Image,
    menu::{MenuBuilder, MenuItemBuilder, PredefinedMenuItem},
    tray::TrayIconBuilder,
    App, Manager,
};

use crate::error::StringResult;
use crate::window;

/// Keep a strong tray handle alive for the full app lifetime.
#[allow(dead_code)]
pub struct TrayIconState(pub tauri::tray::TrayIcon);

pub fn setup(app: &App) -> Result<(), String> {
    let show = MenuItemBuilder::with_id("show", "Show Agentbar")
        .build(app)
        .str_err()?;
    let sep1 = PredefinedMenuItem::separator(app).str_err()?;
    let settings = MenuItemBuilder::with_id("settings", "Settings...")
        .build(app)
        .str_err()?;
    let sep2 = PredefinedMenuItem::separator(app).str_err()?;
    let quit = MenuItemBuilder::with_id("quit", "Quit Agentbar")
        .build(app)
        .str_err()?;

    let menu = MenuBuilder::new(app)
        .items(&[&show, &sep1, &settings, &sep2, &quit])
        .build()
        .str_err()?;

    let icon = Image::from_path("icons/icon.png").str_err()?;

    let tray = TrayIconBuilder::with_id("agentbar-tray")
        .icon(icon)
        // Using a full-color PNG, so keep template mode off.
        .icon_as_template(false)
        .tooltip("Agentbar")
        .menu(&menu)
        .show_menu_on_left_click(true)
        .on_menu_event(handle_menu_event)
        .build(app)
        .str_err()?;

    app.manage(TrayIconState(tray));

    Ok(())
}

#[allow(clippy::needless_pass_by_value)]
fn handle_menu_event(app: &tauri::AppHandle, event: tauri::menu::MenuEvent) {
    match event.id().as_ref() {
        "show" => {
            let _ = window::show(app);
        }
        "settings" => {
            let _ = window::open_settings(app);
        }
        "quit" => {
            app.exit(0);
        }
        _ => {}
    }
}
