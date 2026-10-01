<script lang="ts">
  import type { SiteData } from '../../lib/types';
  import { dotTitle } from '../../lib/format';
  import ScreenHeader from '../ScreenHeader.svelte';

  let { data, onback }: { data: SiteData; onback: () => void } = $props();
  const tile = $derived(data.apps.find((a) => a.id === 'experience')!);
</script>

<div class="screen hu-enter">
  <ScreenHeader title={tile.label} backLabel={data.ui.dock.back} {onback} />
  <div class="rows">
    {#each data.roles as role (role.project)}
      <div class="row">
        <div class="when" class:now={role.end === 'now'}>{role.start} – {role.end}</div>
        <div class="who"><span class="project">{role.project}</span><span class="title">{dotTitle(role.title)}</span></div>
        <div class="blurb">{role.blurb}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .screen { flex-grow: 1; min-width: 0; box-sizing: border-box; padding: 28px 40px; display: flex; flex-direction: column; gap: 18px; }
  .rows { display: flex; flex-direction: column; border-top: 1px solid var(--divider); }
  .row {
    display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 24px; padding: 16px 0;
    border-bottom: 1px solid var(--divider); align-items: baseline;
  }
  .when { font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
  .when.now { color: var(--accent); }
  .who { display: flex; flex-direction: column; gap: 2px; }
  .project { font-size: 17px; font-weight: 600; }
  .title { font-size: 14px; color: var(--muted); }
  .blurb { font-size: 15px; color: var(--soft); line-height: 1.45; }
</style>
