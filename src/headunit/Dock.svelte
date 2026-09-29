<script lang="ts">
  import type { Screen, SiteData } from '../lib/types';
  import Icon from './Icon.svelte';

  let { data, screen, go }: { data: SiteData; screen: Screen; go: (s: Screen) => void } = $props();
  const ui = $derived(data.ui);
  // Four shortcuts, then the grid key — the same shape as a car's sidebar.
  const SHORTCUTS = ['experience', 'writing', 'linkedin', 'email'];
  const shortcuts = $derived(SHORTCUTS.map((id) => data.apps.find((a) => a.id === id)!).filter(Boolean));
  const gridLabel = $derived(screen === 'apps' ? ui.dock.home : ui.home.apps);
</script>

<nav class="dock" aria-label={ui.dock.label}>
  <div class="brand">{ui.brand}</div>
  <div class="apps">
    {#each shortcuts as app (app.id)}
      {#if app.screen}
        <button class="key" type="button" title={app.label} aria-label={app.label} aria-current={screen === app.screen ? 'page' : undefined} onclick={() => go(app.screen!)}>
          <Icon name={app.icon} />
        </button>
      {:else}
        <a class="key" href={app.href} title={app.label} aria-label={app.label} target={app.href?.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer"><Icon name={app.icon} /></a>
      {/if}
    {/each}
  </div>
  <button class="key home" type="button" title={gridLabel} aria-label={gridLabel} aria-current={screen === 'apps' ? 'page' : undefined} onclick={() => go(screen === 'apps' ? 'home' : 'apps')}>
    <Icon name="grid" width={22} height={22} />
  </button>
</nav>

<style>
  .dock {
    width: 96px; flex-shrink: 0; box-sizing: border-box; padding: 22px 0;
    display: flex; flex-direction: column; align-items: center; justify-content: space-between;
    background: var(--dock); border-right: 1px solid var(--rule);
  }
  .brand { font-family: var(--font-mono); font-size: 12px; color: var(--muted); letter-spacing: 0.08em; }
  .apps { display: flex; flex-direction: column; gap: 12px; }
  a.key { text-decoration: none; }
  .key {
    width: max(52px, var(--tap)); height: max(52px, var(--tap)); border: none; border-radius: 15px;
    background: var(--tile); color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer;
    transition: color 0.15s ease, background-color 0.15s ease;
  }
  .key:hover { color: var(--text); background: var(--tile-hover); }
  .key[aria-current='page'] { color: var(--page); background: var(--accent); }
  @media (prefers-reduced-motion: reduce) { .key { transition: none; } }
  .home { border: 1px solid var(--key-border); border-radius: 50%; background: transparent; }
</style>
