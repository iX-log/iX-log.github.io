<script lang="ts">
  import type { SiteData } from '../../lib/types';
  import ScreenHeader from '../ScreenHeader.svelte';

  let { data, onback }: { data: SiteData; onback: () => void } = $props();
  const tile = $derived(data.apps.find((a) => a.id === 'about')!);
</script>

<div class="screen hu-enter">
  <ScreenHeader title={tile.label} backLabel={data.ui.dock.back} {onback} />
  <div class="body">
    <div class="prose">
      {#each data.about as paragraph}<p>{paragraph}</p>{/each}
    </div>
  </div>
</div>

<style>
  .screen { flex-grow: 1; min-width: 0; box-sizing: border-box; padding: 24px 40px 28px; display: flex; flex-direction: column; gap: 14px; }
  .body { display: flex; gap: 36px; min-width: 0; overflow: hidden; }
  .prose {
    max-width: 620px; flex-shrink: 1; display: flex; flex-direction: column; gap: 10px;
    font-size: 15px; line-height: 1.5; color: var(--soft); overflow-y: auto;
  }
  .prose p { margin: 0; }
</style>
