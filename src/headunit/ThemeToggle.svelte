<script lang="ts">
  // Day/night, the way a car display switches. Stored in localStorage and re-applied
  // before paint by the inline script in Base.astro.
  import { onMount } from 'svelte';

  let { labels, round = false, pill = false, text = '' }: { labels: { toDay: string; toNight: string }; round?: boolean; pill?: boolean; text?: string } = $props();

  const KEY = 'ix-theme';
  const METAS: Record<'night' | 'day', string> = { night: '#0b0c0e', day: '#e9ebef' };

  // Rendered on the server too (client:load in the header), so read the DOM only after mount.
  let theme = $state<'night' | 'day'>('night');
  onMount(() => {
    theme = document.documentElement.dataset.theme === 'day' ? 'day' : 'night';
  });

  function toggle() {
    theme = theme === 'night' ? 'day' : 'night';
    if (theme === 'day') document.documentElement.dataset.theme = 'day';
    else delete document.documentElement.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', METAS[theme]);
    try { localStorage.setItem(KEY, theme); } catch { /* private mode: choice just won't persist */ }
  }
</script>

<button
  class="key"
  class:round
  class:pill
  type="button"
  aria-pressed={theme === 'day'}
  aria-label={theme === 'night' ? labels.toDay : labels.toNight}
  title={theme === 'night' ? labels.toDay : labels.toNight}
  onclick={toggle}
>
  <span class="glyph" aria-hidden="true">🌗</span>
  {#if pill && text}<span class="text">{text}</span>{/if}
</button>

<style>
  .key {
    width: max(44px, var(--tap, 44px)); height: max(44px, var(--tap, 44px));
    border: 1px solid var(--key-border); border-radius: 14px; background: transparent;
    color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease;
  }
  .key:hover { color: var(--text); border-color: var(--pill-border); }
  .round { border-radius: 50%; }
  .pill {
    width: auto; gap: 10px; padding: 0 20px; border-radius: 999px;
    font-family: var(--font-sans); font-size: 15px; font-weight: 600; color: var(--text);
  }
  .pill .text { line-height: 1; }
  .glyph { font-size: 17px; line-height: 1; }
  @media (prefers-reduced-motion: reduce) { .key { transition: none; } }
</style>
