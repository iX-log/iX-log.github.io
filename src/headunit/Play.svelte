<script lang="ts">
  // The playful corner: the QR that turns this page into the companion app, and the
  // Part Deux accent toggle. Desktop only — a QR code on the device you're holding is useless.
  import type { SiteData } from '../lib/types';

  let { data }: { data: SiteData } = $props();
  const ui = $derived(data.ui);
  const play = $derived(ui.play);
  const sync = $derived(ui.companion.sync);

  // First word solid, the rest stepped back — same treatment as the boring version's heading.
  const head = $derived(play.title.split(' ')[0]);
  const rest = $derived(play.title.slice(play.title.indexOf(' ')));

  let dress = $state<'blue' | 'pink'>('blue');
  function pick(next: 'blue' | 'pink') {
    dress = next;
    const root = document.documentElement.style;
    if (next === 'pink') root.setProperty('--accent', 'var(--pink)');
    else root.removeProperty('--accent');
  }
</script>

<section class="play" aria-labelledby="play-title">
  <div class="intro">
    <h2 id="play-title" class="two-tone"><strong>{head}</strong>{rest}</h2>
    <p>{play.blurb}</p>
  </div>

  <div class="cards">
    <div class="card qr-card">
      <p class="qr-text"><strong>{ui.widgets.qr.lead}</strong> {ui.widgets.qr.text}</p>
      <div class="qr" role="img" aria-label={ui.widgets.qr.alt}>{@html data.qr.svg}</div>
    </div>

    <div class="card dress">
      <span class="label">{play.dressLabel}</span>
      <div class="toggle" role="group" aria-label={play.dressLabel}>
        <button type="button" class:on={dress === 'pink'} aria-pressed={dress === 'pink'} onclick={() => pick('pink')}>{sync.pink}</button>
        <button type="button" class:on={dress === 'blue'} aria-pressed={dress === 'blue'} onclick={() => pick('blue')}>{sync.blue}</button>
      </div>
      <p class="hint">{play.dressHint}</p>
    </div>
  </div>
</section>

<style>
  .play {
    margin-top: 36px; padding-top: 40px; border-top: 1px solid var(--rule);
    display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 48px;
  }
  .intro { display: flex; flex-direction: column; gap: 10px; align-self: start; }
  .intro h2 { font-size: clamp(28px, 3vw, 36px); font-weight: 700; font-stretch: 112%; line-height: 1.2; margin: 0; }
  .intro p { margin: 0; font-size: 15px; line-height: 1.55; color: var(--muted); }

  .cards { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 20px; align-items: start; }
  .card { border-radius: 20px; background: var(--tile); box-sizing: border-box; }
  .qr-card { padding: 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .qr-text { margin: 0; font-size: 16px; line-height: 1.45; }
  .qr-text strong { font-weight: 600; }
  .qr { width: 132px; height: 132px; flex-shrink: 0; border-radius: 10px; overflow: hidden; line-height: 0; }
  .qr :global(svg) { width: 100%; height: 100%; display: block; }

  .dress { padding: 24px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
  .label { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .toggle { display: inline-flex; padding: 4px; gap: 4px; border-radius: 999px; background: var(--surface-2); }
  .toggle button {
    border: none; border-radius: 999px; min-height: 44px; padding: 0 18px; cursor: pointer;
    font-family: var(--font-sans); font-size: 15px; font-weight: 600; background: transparent; color: var(--muted);
  }
  .toggle button.on { background: var(--accent); color: var(--page); }
  .hint { margin: 0; font-size: 13px; line-height: 1.45; color: var(--muted); }

  @media (max-width: 1100px) { .cards { grid-template-columns: minmax(0, 1fr); } }
  @media (max-width: 900px) { .play { grid-template-columns: 1fr; gap: 28px; } }
  @media (max-width: 767px) { .play { display: none; } }
</style>
