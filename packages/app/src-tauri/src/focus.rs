//! Capture and restore the previously frontmost app.

use std::sync::Mutex;

static PREVIOUS_APP: Mutex<Option<String>> = Mutex::new(None);

/// Capture current frontmost app before showing Agentbar.
pub fn capture_frontmost_app() {
    if let Some(id) = platform::get_frontmost_app() {
        if let Ok(mut prev) = PREVIOUS_APP.lock() {
            *prev = Some(id);
        }
    }
}

/// Restore focus back to previously frontmost app after hiding Agentbar.
pub fn restore_previous_app() {
    let app_id = PREVIOUS_APP.lock().ok().and_then(|mut prev| prev.take());
    if let Some(id) = app_id {
        platform::activate_app(&id);
    }
}

#[cfg(target_os = "macos")]
mod platform {
    use std::process::Command;

    pub fn get_frontmost_app() -> Option<String> {
        let output = Command::new("osascript")
            .args([
                "-e",
                "tell application \"System Events\" to get bundle identifier of first application process whose frontmost is true",
            ])
            .output()
            .ok()?;

        let id = String::from_utf8_lossy(&output.stdout).trim().to_string();
        if id.is_empty() || id == "missing value" {
            None
        } else {
            Some(id)
        }
    }

    pub fn activate_app(bundle_id: &str) {
        let script = format!(
            "tell application \"System Events\" to set frontmost of every process whose bundle identifier is \"{bundle_id}\" to true"
        );
        let _ = Command::new("osascript").args(["-e", &script]).output();
    }
}

#[cfg(target_os = "linux")]
mod platform {
    use std::process::Command;

    pub fn get_frontmost_app() -> Option<String> {
        let output = Command::new("xdotool")
            .args(["getactivewindow"])
            .output()
            .ok()?;
        let id = String::from_utf8_lossy(&output.stdout).trim().to_string();
        if id.is_empty() {
            None
        } else {
            Some(id)
        }
    }

    pub fn activate_app(window_id: &str) {
        let _ = Command::new("xdotool")
            .args(["windowactivate", window_id])
            .output();
    }
}

#[cfg(target_os = "windows")]
mod platform {
    pub const fn get_frontmost_app() -> Option<String> {
        None
    }

    pub const fn activate_app(_id: &str) {}
}
