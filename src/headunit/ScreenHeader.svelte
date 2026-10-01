<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from './Icon.svelte';

  let { title, subtitle, backLabel, onback, right }: {
    title: string;
    subtitle?: string;
    backLabel: string;
    onback: () => void;
    right?: Snippet;
  } = $props();
</script>

<div class="bar">
  <div class="lead">
    <button class="back" type="button" aria-label={backLabel} onclick={onback}>
      <Icon name="back" width={20} height={20} stroke={1.8} />
    </button>
    <div class="titles">
      <!-- Focus lands here when an app opens (see Unit.svelte). -->
      <h2 tabindex="-1" data-focus-target>{title}</h2>
      {#if subtitle}<p>{subtitle}</p>{/if}
    </div>
  </div>
  {@render right?.()}
</div>

<style>
  .bar { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
  .lead { display: flex; align-items: center; gap: 14px; min-width: 0; }
  .back {
    width: var(--tap); height: var(--tap); flex-shrink: 0; border: none; border-radius: 50%;
    background: var(--tile); color: var(--text); display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .titles { display: flex; flex-direction: column; min-width: 0; }
  h2 { margin: 0; font-size: 30px; font-weight: 700; font-stretch: 112%; line-height: normal; }
  p { margin: 0; font-size: 15px; color: var(--muted); }
</style>
