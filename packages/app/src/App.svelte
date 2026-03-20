<script lang="ts">
  import { onMount } from "svelte";
  import { instanceStore } from "./lib/instance-store.js";
  import { MOCK_INSTANCES } from "./lib/mock-data.js";

  const instances = instanceStore;
  const aggregate = instanceStore.aggregate;

  onMount(() => {
    instanceStore.reconcile(MOCK_INSTANCES);
  });

  const STATUS_ICONS: Record<string, string> = {
    working: "⚙️",
    idle: "💤",
    waiting: "⏳",
    error: "❌",
    disconnected: "🔌",
    none: "—",
  };

  const STATUS_COLORS: Record<string, string> = {
    working: "#4ade80",
    idle: "#94a3b8",
    waiting: "#facc15",
    error: "#f87171",
    disconnected: "#a78bfa",
    none: "#64748b",
  };

  function relativeTime(iso: string): string {
    const diff = Math.max(0, Date.now() - new Date(iso).getTime());
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  }
</script>

<main>
  <header>
    <h1>Agentbar Simulator</h1>
    <p class="subtitle">Developer preview — mock data loaded</p>
  </header>

  <section class="tray-preview" aria-label="Tray summary">
    <span class="tray-icon">{STATUS_ICONS[$aggregate.dominant]}</span>
    <span class="tray-text">{$aggregate.trayText}</span>
  </section>

  <section class="counts" aria-label="Status counts">
    {#each Object.entries($aggregate.counts) as [status, rawCount]}
      {@const count = Number(rawCount)}
      {#if count > 0}
        <span class="badge" style="background: {STATUS_COLORS[status]}">
          {STATUS_ICONS[status]}
          {count}
          {status}
        </span>
      {/if}
    {/each}
  </section>

  <section class="instance-list" aria-label="Instance list">
    {#if $instances.size === 0}
      <div class="empty-state">No active sessions</div>
    {:else}
      {#each [...$instances.values()] as instance (instance.id)}
        <article class="instance-card" data-status={instance.status}>
          <div class="card-header">
            <span class="status-icon">{STATUS_ICONS[instance.status]}</span>
            <strong class="project-name">{instance.projectName}</strong>
            <span
              class="status-label"
              style="color: {STATUS_COLORS[instance.status]}"
            >
              {instance.status}
            </span>
          </div>
          <div class="card-meta">
            <span class="instance-id">ID: {instance.id}</span>
            <span class="server-url">{instance.serverUrl}</span>
            <span class="last-activity"
              >{relativeTime(instance.lastActivityAt)}</span
            >
          </div>
        </article>
      {/each}
    {/if}
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    background: #0f172a;
    color: #e2e8f0;
    min-height: 100vh;
  }

  main {
    max-width: 680px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  header {
    margin-bottom: 1.25rem;
  }

  h1 {
    margin: 0 0 0.25rem;
    font-size: 1.5rem;
    color: #f1f5f9;
  }

  .subtitle {
    margin: 0;
    color: #94a3b8;
    font-size: 0.875rem;
  }

  .tray-preview {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background: #1e293b;
    margin-bottom: 0.75rem;
  }

  .tray-icon {
    font-size: 1.2rem;
  }

  .tray-text {
    font-weight: 600;
    color: #cbd5e1;
  }

  .counts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-bottom: 1rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    color: #0f172a;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: lowercase;
  }

  .instance-list {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .empty-state {
    border-radius: 0.5rem;
    padding: 1.5rem;
    text-align: center;
    color: #64748b;
    background: #1e293b;
  }

  .instance-card {
    background: #1e293b;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    border-left: 3px solid transparent;
  }

  .instance-card[data-status="working"] {
    border-left-color: #4ade80;
  }

  .instance-card[data-status="waiting"] {
    border-left-color: #facc15;
  }

  .instance-card[data-status="error"] {
    border-left-color: #f87171;
  }

  .instance-card[data-status="idle"] {
    border-left-color: #94a3b8;
  }

  .instance-card[data-status="disconnected"] {
    border-left-color: #a78bfa;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }

  .project-name {
    flex: 1;
    font-size: 0.95rem;
  }

  .status-label {
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .card-meta {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .server-url {
    color: #64748b;
  }
</style>
