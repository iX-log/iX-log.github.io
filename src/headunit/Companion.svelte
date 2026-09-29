<script lang="ts">
  import type { SiteData } from '../lib/types';
  import Icon from './Icon.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  let { data }: { data: SiteData } = $props();
  const ui = $derived(data.ui.companion);

  // Local-only easter egg: recolors this widget alone, doesn't touch the rest of the page,
  // resets on reload. No sync with the head unit — that's the point of the QR code instead.
  let dress = $state<'pink' | 'blue'>('pink');
  const dressColor = $derived(dress === 'pink' ? 'var(--pink)' : 'var(--accent)');

  const pillText = $derived(data.ui.companion.pill.replace('{host}', data.host));

  // The same apps as the head unit: a screen app points at its section of the boring
  // version below, a link app goes where it goes.
  const rows = $derived(data.apps.map((a) => ({ ...a, target: a.href ?? `#boring-${a.screen}` })));
</script>

<div class="companion hu-enter">
  <div class="ctop">
    <div class="pill">
      <span class="dot" aria-hidden="true"></span>
      {pillText}
    </div>
    <ThemeToggle labels={data.ui.theme} round />
  </div>

  <div class="sync" style:--dress={dressColor}>
    <div class="sync-top">
      <span class="label">{ui.sync.label}</span>
      <span class="tag">{ui.sync.tag}</span>
    </div>
    <p class="blurb">{ui.sync.blurb}</p>
    <div class="toggle" role="group" aria-label={ui.sync.label}>
      <button type="button" aria-pressed={dress === 'pink'} class:on={dress === 'pink'} style:--c="var(--pink)" onclick={() => (dress = 'pink')}>{ui.sync.pink}</button>
      <button type="button" aria-pressed={dress === 'blue'} class:on={dress === 'blue'} style:--c="var(--accent)" onclick={() => (dress = 'blue')}>{ui.sync.blue}</button>
    </div>
  </div>

  <nav class="rows" aria-label="Sections">
    {#each rows as row (row.id)}
      <a class="row" href={row.target} target={row.href && !row.href.startsWith('mailto:') ? '_blank' : undefined} rel={row.href ? 'noopener noreferrer' : undefined}>
        <span class="words"><span class="row-label">{row.label}</span><span class="row-hint">{row.hint}</span></span>
        <Icon name="back" width={18} height={18} stroke={1.8} />
      </a>
    {/each}
  </nav>

  <div class="bottom">
    {#if data.cvUrl}<a class="cv" href={data.cvUrl}>{data.ui.boring.cv}</a>{/if}
    <div class="social">
      <a class="round" href={data.links.github} rel="me" aria-label={data.ui.header.github}><Icon name="github" width={20} height={20} /></a>
      <a class="round" href={data.links.linkedin} rel="me" aria-label={data.ui.header.linkedin}><Icon name="linkedin" width={20} height={20} /></a>
    </div>
  </div>
</div>

<style>
  .companion { display: flex; flex-direction: column; gap: 20px; }
  .ctop { display: flex; align-items: center; justify-content: space-between; gap: 12px; }

  .pill {
    display: inline-flex; align-items: center; gap: 8px; align-self: flex-start;
    padding: 8px 12px; border-radius: 999px; background: var(--surface-2);
    font-family: var(--font-mono); font-size: 12px; color: var(--muted);
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); animation: pulse 2s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { .dot { animation: none; } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

  .sync { border-radius: 20px; background: var(--surface-2); padding: 18px; display: flex; flex-direction: column; gap: 14px; box-shadow: inset 0 0 0 1px transparent; transition: box-shadow 0.2s ease; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dress) 35%, transparent); }
  .sync-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .label { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .tag { font-size: 12px; color: var(--muted); }
  .blurb { margin: 0; font-size: 15px; line-height: 1.4; }
  .toggle { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 4px; gap: 4px; border-radius: 999px; background: var(--page); }
  .toggle button {
    border: none; border-radius: 999px; min-height: 44px; font-family: var(--font-sans); font-size: 15px; font-weight: 600;
    cursor: pointer; background: transparent; color: var(--muted);
  }
  .toggle button.on { background: var(--c); color: var(--page); }

  .rows { display: flex; flex-direction: column; border-radius: 20px; overflow: hidden; background: var(--surface-2); }
  .row {
    text-decoration: none; color: var(--text); display: flex; align-items: center; justify-content: space-between;
    min-height: 60px; padding: 0 18px; border-bottom: 1px solid var(--tile-hover); transition: background-color 0.15s ease;
  }
  .row:last-child { border-bottom: none; }
  .row:hover { background-color: var(--tile-hover); }
  .row :global(svg) { transform: rotate(180deg); color: var(--muted); flex-shrink: 0; }
  .words { display: flex; flex-direction: column; min-width: 0; }
  .row-label { font-size: 17px; font-weight: 600; }
  .row-hint { font-size: 13px; color: var(--muted); }

  .bottom { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .cv {
    display: inline-flex; align-items: center; min-height: 44px; padding: 0 18px;
    font-size: 15px; font-weight: 600; border-radius: 999px; background: var(--text); color: var(--page); text-decoration: none;
  }
  .cv:hover { color: var(--page); }
  .social { display: flex; gap: 6px; }
  .round { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--surface-2); color: var(--text); }
</style>
