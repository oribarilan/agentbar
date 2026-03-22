import { useCallback, useEffect, useState } from "react";
import { getConfig, getDefaultConfig, updateConfig, type AgentbarConfig } from "../lib/commands";

export function useConfig() {
  const [config, setConfig] = useState<AgentbarConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getConfig()
      .then((cfg) => {
        setConfig(cfg);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const update = useCallback(async (newConfig: AgentbarConfig) => {
    await updateConfig(newConfig);
    setConfig(newConfig);
  }, []);

  const resetSection = useCallback(
    async (section: keyof AgentbarConfig) => {
      if (!config) return;
      const defaults = await getDefaultConfig();
      const updated = { ...config, [section]: defaults[section] };
      await updateConfig(updated);
      setConfig(updated);
      return updated;
    },
    [config],
  );

  return { config, isLoading, update, resetSection };
}
