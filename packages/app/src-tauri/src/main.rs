#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    collections::BTreeMap,
    fs,
    path::PathBuf,
    sync::{Arc, Mutex},
    time::Duration,
};

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    AppHandle, Runtime,
};
#[cfg(target_os = "macos")]
use tauri::ActivationPolicy;

const TRAY_ID: &str = "main-tray";
const SCAN_INTERVAL_SECONDS: u64 = 2;

#[derive(Clone, Debug, PartialEq, Eq)]
enum StatusHint {
    Working,
    Idle,
    WaitingForInput,
    Error,
    Unknown,
}

#[derive(Clone, Debug)]
struct InstanceSummary {
    project_name: String,
    status_hint: StatusHint,
}

#[derive(Clone, Debug)]
struct TraySummary {
    title: String,
    tooltip: String,
    items: Vec<String>,
}

fn main() {
    let state = Arc::new(Mutex::new(TraySummary {
        title: "○ 0".to_string(),
        tooltip: "Agentbar: no active OpenCode sessions".to_string(),
        items: vec!["No active sessions".to_string()],
    }));

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup({
            let state = Arc::clone(&state);
            move |app| {
                #[cfg(target_os = "macos")]
                {
                    app.set_activation_policy(ActivationPolicy::Accessory);
                }

                let menu = build_tray_menu(app.handle(), &state.lock().expect("lock").items)?;

                TrayIconBuilder::with_id(TRAY_ID)
                    .menu(&menu)
                    .icon_as_template(true)
                    .tooltip("Agentbar")
                    .show_menu_on_left_click(true)
                    .on_menu_event(|app, event| {
                        if event.id().as_ref() == "quit" {
                            app.exit(0);
                        }
                    })
                    .build(app)?;

                let handle = app.handle().clone();
                tauri::async_runtime::spawn(async move {
                    let mut interval = tokio::time::interval(Duration::from_secs(
                        SCAN_INTERVAL_SECONDS,
                    ));
                    loop {
                        interval.tick().await;
                        if let Err(error) = refresh_tray(&handle, Arc::clone(&state)) {
                            if let Some(tray) = handle.tray_by_id(TRAY_ID) {
                                let _ = tray.set_title(Some("⚠"));
                                let _ = tray.set_tooltip(Some(format!(
                                    "Agentbar scan error: {error}"
                                )));
                            }
                        }
                    }
                });

                Ok(())
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Agentbar");
}

fn refresh_tray<R: Runtime>(
    app: &AppHandle<R>,
    state: Arc<Mutex<TraySummary>>,
) -> Result<(), String> {
    let instances = discover_instances();
    let summary = summarize(&instances);

    let tray = app
        .tray_by_id(TRAY_ID)
        .ok_or_else(|| "tray not found".to_string())?;

    tray.set_title(Some(&summary.title))
        .map_err(|err| err.to_string())?;
    tray.set_tooltip(Some(&summary.tooltip))
        .map_err(|err| err.to_string())?;

    let menu = build_tray_menu(app, &summary.items).map_err(|err| err.to_string())?;
    tray.set_menu(Some(menu)).map_err(|err| err.to_string())?;

    if let Ok(mut guard) = state.lock() {
        *guard = summary;
    }

    Ok(())
}

fn build_tray_menu<R: Runtime>(
    app: &AppHandle<R>,
    instance_items: &[String],
) -> tauri::Result<tauri::menu::Menu<R>> {
    let mut builder = MenuBuilder::new(app);

    for (idx, item) in instance_items.iter().enumerate() {
        let id = format!("instance-{idx}");
        let menu_item = MenuItemBuilder::with_id(id, item).enabled(false).build(app)?;
        builder = builder.item(&menu_item);
    }

    let separator = tauri::menu::PredefinedMenuItem::separator(app)?;
    let quit = MenuItemBuilder::with_id("quit", "Quit Agentbar").build(app)?;

    builder.item(&separator).item(&quit).build()
}

fn discover_instances() -> Vec<InstanceSummary> {
    let Some(dir) = default_instances_dir() else {
        return Vec::new();
    };

    let Ok(entries) = fs::read_dir(dir) else {
        return Vec::new();
    };

    let mut instances = Vec::new();

    for entry in entries.flatten() {
        let path = entry.path();
        let Some(name) = path.file_name().and_then(|file_name| file_name.to_str()) else {
            continue;
        };

        if !name.ends_with(".json") || name.ends_with(".json.tmp") {
            continue;
        }

        let Ok(raw) = fs::read_to_string(&path) else {
            continue;
        };

        let Ok(value) = serde_json::from_str::<serde_json::Value>(&raw) else {
            continue;
        };

        let Some(project_name) = value
            .get("projectName")
            .and_then(|field| field.as_str())
            .map(|text| text.trim().to_string())
            .filter(|text| !text.is_empty())
        else {
            continue;
        };

        let Some(_id) = value
            .get("id")
            .and_then(|field| field.as_str())
            .map(|text| text.trim().to_string())
            .filter(|text| !text.is_empty())
        else {
            continue;
        };

        let status_hint = value
            .get("statusHint")
            .and_then(|field| field.as_str())
            .map(StatusHint::from)
            .unwrap_or(StatusHint::Unknown);

        instances.push(InstanceSummary {
            project_name,
            status_hint,
        });
    }

    instances
}

fn summarize(instances: &[InstanceSummary]) -> TraySummary {
    if instances.is_empty() {
        return TraySummary {
            title: "○ 0".to_string(),
            tooltip: "Agentbar: no active OpenCode sessions".to_string(),
            items: vec!["No active sessions".to_string()],
        };
    }

    let mut status_counts: BTreeMap<&'static str, usize> = BTreeMap::new();
    let mut items = Vec::with_capacity(instances.len());

    for instance in instances {
        let status_label = instance.status_hint.label();
        *status_counts.entry(status_label).or_insert(0) += 1;
        items.push(format!("{} — {}", instance.project_name, status_label));
    }

    items.sort();

    let dominant = if status_counts.contains_key("error") {
        "⚠"
    } else if status_counts.contains_key("waiting") {
        "⏳"
    } else if status_counts.contains_key("working") {
        "⚙"
    } else if status_counts.contains_key("disconnected") {
        "🔌"
    } else {
        "●"
    };

    let mut tooltip_parts: Vec<String> = Vec::new();
    for status in ["working", "waiting", "error", "idle", "disconnected"] {
        if let Some(count) = status_counts.get(status) {
            tooltip_parts.push(format!("{count} {status}"));
        }
    }

    TraySummary {
        title: format!("{dominant} {}", instances.len()),
        tooltip: format!("Agentbar: {}", tooltip_parts.join(" · ")),
        items,
    }
}

fn default_instances_dir() -> Option<PathBuf> {
    if let Some(override_dir) = std::env::var_os("AGENTBAR_INSTANCES_DIR") {
        return Some(PathBuf::from(override_dir));
    }

    std::env::var_os("HOME").map(|home| {
        PathBuf::from(home)
            .join(".local")
            .join("share")
            .join("agentbar")
            .join("instances")
    })
}

impl From<&str> for StatusHint {
    fn from(value: &str) -> Self {
        match value {
            "working" => StatusHint::Working,
            "idle" => StatusHint::Idle,
            "waiting_for_input" => StatusHint::WaitingForInput,
            "error" => StatusHint::Error,
            _ => StatusHint::Unknown,
        }
    }
}

impl StatusHint {
    fn label(&self) -> &'static str {
        match self {
            StatusHint::Working => "working",
            StatusHint::Idle => "idle",
            StatusHint::WaitingForInput => "waiting",
            StatusHint::Error => "error",
            StatusHint::Unknown => "disconnected",
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{summarize, InstanceSummary, StatusHint};

    fn make_instance(project: &str, status_hint: StatusHint) -> InstanceSummary {
        InstanceSummary {
            project_name: project.to_string(),
            status_hint,
        }
    }

    #[test]
    fn summarize_empty_state() {
        let summary = summarize(&[]);
        assert_eq!(summary.title, "○ 0");
        assert!(summary.tooltip.contains("no active"));
        assert_eq!(summary.items, vec!["No active sessions".to_string()]);
    }

    #[test]
    fn summarize_waiting_over_working() {
        let summary = summarize(&[
            make_instance("project-a", StatusHint::Working),
            make_instance("project-b", StatusHint::WaitingForInput),
        ]);

        assert_eq!(summary.title, "⏳ 2");
        assert!(summary.tooltip.contains("1 working"));
        assert!(summary.tooltip.contains("1 waiting"));
    }

    #[test]
    fn summarize_error_overrides_other_statuses() {
        let summary = summarize(&[
            make_instance("project-a", StatusHint::Idle),
            make_instance("project-b", StatusHint::Error),
        ]);

        assert_eq!(summary.title, "⚠ 2");
        assert!(summary.tooltip.contains("1 error"));
    }
}
