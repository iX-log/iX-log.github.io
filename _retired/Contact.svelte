<script lang="ts">
  import type { SiteData } from '../../lib/types';
  import ScreenHeader from '../ScreenHeader.svelte';

  let { data, onback }: { data: SiteData; onback: () => void } = $props();
  const tile = $derived(data.ui.tiles.find((t) => t.id === 'contact')!);
</script>

<div class="screen hu-enter">
  <ScreenHeader title={tile.label} backLabel={data.ui.dock.back} {onback} />
  <div class="cards">
    {#each data.contacts as c, i (c.id)}
      <a class="card" href={c.href}>
        <span class="label" class:accent={i === 0}>{c.label}</span>
        <span class="value">{c.value}</span>
      </a>
    {/each}
  </div>
</div>

<style>
  .screen { flex-grow: 1; min-width: 0; box-sizing: border-box; padding: 28px 40px; display: flex; flex-direction: column; gap: 18px; }
  .cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .card { text-decoration: none; border-radius: 18px; background: var(--tile); padding: 24px; display: flex; flex-direction: column; gap: 6px; color: var(--text); }
  .card:hover { background: var(--tile-hover); }
  .label { font-family: var(--font-mono); font-size: 12px; color: var(--muted); text-transform: uppercase; }
  .label.accent { color: var(--accent); }
  .value { font-size: 20px; font-weight: 600; }
</style>
