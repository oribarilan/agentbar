import { invoke } from "@tauri-apps/api/core";

export interface GeneralConfig {
  hotkey: string;
  launch_at_login: boolean;
}

export interface AppearanceConfig {
  theme: string;
  font_size: string;
}

export interface AgentbarConfig {
  general: GeneralConfig;
  appearance: AppearanceConfig;
}

export async function hideWindow(): Promise<void> {
  return invoke("hide_window");
}

export async function showWindow(): Promise<void> {
  return invoke("show_window");
}

export async function toggleWindow(): Promise<void> {
  return invoke("toggle_window");
}

export async function openSettings(): Promise<void> {
  return invoke("open_settings");
}

export async function getConfig(): Promise<AgentbarConfig> {
  return invoke("get_config");
}

export async function getDefaultConfig(): Promise<AgentbarConfig> {
  return invoke("get_default_config");
}

export async function updateConfig(config: AgentbarConfig): Promise<void> {
  return invoke("update_config", { newConfig: config });
}
