//! Agentbar barebones Tauri shell:
//! - global hotkey launcher
//! - tray/menubar item
//! - settings window

mod commands;
pub mod config;
mod error;
mod focus;
mod hotkey;
mod tray;
mod window;

use tauri::Manager;

/// Boot the Tauri application.
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            commands::window::toggle_window,
            commands::window::show_window,
            commands::window::hide_window,
            commands::window::open_settings,
            commands::config::get_config,
            commands::config::get_default_config,
            commands::config::update_config,
        ])
        .setup(|app| {
            let cfg = config::load_or_default();

            hotkey::register_main_hotkey(&app.handle().clone(), &cfg.general.hotkey)?;

            app.manage(config::AppConfig::new(cfg));
            tray::setup(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
