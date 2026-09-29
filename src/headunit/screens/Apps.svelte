<script lang="ts">
  // The launcher: every destination as an app. Four open a screen on the unit,
  // four leave for a link — same tile either way, so the set reads as one family.
  import type { Screen, SiteData } from '../../lib/types';
  import Icon from '../Icon.svelte';
  import ScreenHeader from '../ScreenHeader.svelte';

  let { data, go, onback }: { data: SiteData; go: (s: Screen) => void; onback: () => void } = $props();
  const ui = $derived(data.ui);
</script>

<div class="screen hu-enter">
  <ScreenHeader title={ui.home.apps} backLabel={ui.dock.back} {onback} />
  <div class="grid">
    {#each data.apps as app (app.id)}
      {#if app.screen}
        <button class="hu-tile tile" type="button" onclick={() => go(app.screen!)}>
          <span class="icon" class:accent={app.id === 'bench'}><Icon name={app.icon} width={26} height={26} /></span>
          <span class="words"><span class="tile-label">{app.label}</span><span class="tile-hint">{app.hint}</span></span>
        </button>
      {:else}
        <a class="hu-tile tile" href={app.href} target={app.href?.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">
          <span class="icon"><Icon name={app.icon} width={26} height={26} /></span>
          <span class="words"><span class="tile-label">{app.label}<span class="out" aria-hidden="true"> ↗</span></span><span class="tile-hint">{app.hint}</span></span>
        </a>
      {/if}
    {/each}
  </div>
</div>

<style>
  .screen { flex-grow: 1; min-width: 0; box-sizing: border-box; padding: 22px 28px 26px; display: flex; flex-direction: column; gap: 16px; }
  .grid { flex-grow: 1; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
  .tile {
    border: none; border-radius: 20px; color: var(--text); cursor: pointer; padding: 18px; text-decoration: none;
    background: linear-gradient(180deg, color-mix(in srgb, var(--tile) 94%, var(--text)), var(--tile));
    display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 14px;
    font-family: inherit; text-align: left;
  }
  .icon {
    width: 52px; height: 52px; border-radius: 15px; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, color-mix(in srgb, var(--text) 12%, transparent), var(--divider));
    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text) 10%, transparent);
  }
  .accent { color: var(--accent); }
  .words { display: flex; flex-direction: column; gap: 2px; }
  .tile-label { font-size: 18px; font-weight: 600; font-stretch: 106%; }
  .out { color: var(--muted); font-size: 14px; }
  .tile-hint { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
</style>
