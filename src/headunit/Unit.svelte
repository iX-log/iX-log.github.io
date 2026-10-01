<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type { Screen, SiteData } from '../lib/types';
  import { screenFromHash, urlFor } from './router';
  import { track } from '../lib/track';
  import Dock from './Dock.svelte';
  import Handshake from './Handshake.svelte';
  import Home from './Home.svelte';
  import Off from './Off.svelte';
  import Icon from './Icon.svelte';
  import Apps from './screens/Apps.svelte';
  import Experience from './screens/Experience.svelte';
  import Talks from './screens/Talks.svelte';
  import Bench from './screens/Bench.svelte';
  import About from './screens/About.svelte';

  let { data }: { data: SiteData } = $props();
  const ui = $derived(data.ui);

  // The off-site links and mail live down here, on the same line as the power key.
  const social = $derived([
    { key: 'medium' as const, href: data.links.medium, label: ui.header.writing, rel: 'noopener noreferrer' },
    { key: 'github' as const, href: data.links.github, label: ui.header.github, rel: 'me noopener noreferrer' },
    { key: 'linkedin' as const, href: data.links.linkedin, label: ui.header.linkedin, rel: 'me noopener noreferrer' },
    { key: 'mail' as const, href: `mailto:${data.links.email}`, label: ui.header.email, rel: undefined },
  ]);

  // Bezel outer size: 1280x480 display (8:3) + 20px bezel + 1px border on each side.
  const W = 1322;
  const H = 522;
  const HANDSHAKE_MS = 1400; // brief: under 1.5s
  const SEEN_KEY = 'hu-connected';

  const seenBefore = () => {
    try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
  };
  const markSeen = () => {
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* private mode: handshake just replays */ }
  };

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const initialScreen = screenFromHash(location.hash) ?? 'home';

  // Handshake is skipped for reduced motion, repeat visits (this session) and deep links like /#bench.
  let phase = $state<'connecting' | 'ready' | 'off'>(reducedMotion || seenBefore() || initialScreen !== 'home' ? 'ready' : 'connecting');
  // Where the sweep lands when it finishes: back to the dashboard, or off.
  let landing = $state<'ready' | 'off'>('ready');
  let screen = $state<Screen>(initialScreen);
  let announce = $state('');
  let stage: HTMLDivElement | undefined = $state();
  let scale = $state(1);
  let ripple = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  // One nudge per visit: the power key glows twice a few seconds after the unit is up, then never again.
  const NUDGE_KEY = 'hu-power-nudged';
  const NUDGE_DELAY_MS = 9000;
  let nudge = $state(false);
  let nudgeTimer: ReturnType<typeof setTimeout> | undefined;
  const nudgedBefore = () => {
    try { return sessionStorage.getItem(NUDGE_KEY) === '1'; } catch { return false; }
  };
  const markNudged = () => {
    try { sessionStorage.setItem(NUDGE_KEY, '1'); } catch { /* private mode: at worst it nudges again */ }
  };
  $effect(() => {
    if (phase !== 'ready' || reducedMotion || nudgedBefore()) return;
    nudgeTimer = setTimeout(() => { nudge = true; markNudged(); }, NUDGE_DELAY_MS);
    return () => clearTimeout(nudgeTimer);
  });

  function focusTarget() {
    stage?.querySelector<HTMLElement>('[data-focus-target]')?.focus({ preventScroll: true });
  }

  async function finishHandshake() {
    if (phase !== 'connecting') return;
    clearTimeout(timer);
    const hadFocus = !!stage?.contains(document.activeElement);
    phase = landing;
    markSeen();
    if (!reducedMotion) {
      ripple = true;
      setTimeout(() => (ripple = false), 1000);
    }
    announce = landing === 'off' ? ui.power.offTitle : ui.handshake.done;
    await tick();
    if (hadFocus) focusTarget(); // keyboard user skipped: don't drop their focus on <body>
  }

  function startHandshake(to: 'ready' | 'off' = 'ready') {
    clearTimeout(timer);
    landing = to;
    phase = 'connecting';
    announce = to === 'off' ? ui.power.goingOff : ui.handshake.title;
    timer = setTimeout(finishHandshake, HANDSHAKE_MS);
  }

  /** The power key: same sweep either way, it just lands somewhere different. */
  function togglePower() {
    // Found it on their own: no need to point at it any more.
    clearTimeout(nudgeTimer);
    nudge = false;
    markNudged();
    if (phase === 'connecting') { void finishHandshake(); return; }
    track('power', { to: phase === 'off' ? 'on' : 'off' });
    startHandshake(phase === 'off' ? 'ready' : 'off');
  }

  async function show(next: Screen) {
    if (next === screen || phase === 'off') return;
    screen = next;
    // Screens only change the #hash, which Umami doesn't count as a page view.
    track('screen', { screen: next });
    await tick();
    focusTarget(); // opening an app moves focus to its heading
  }

  /** In-app navigation: push a history entry so the browser back button works. */
  function go(next: Screen) {
    if (next === screen) return;
    history.pushState(null, '', urlFor(next));
    void show(next);
  }

  function syncFromLocation() {
    const next = screenFromHash(location.hash);
    if (next) void show(next);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Escape' || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (phase === 'connecting') void finishHandshake();
    else if (phase === 'off') togglePower();
    else if (screen !== 'home') go('home');
  }

  onMount(() => {
    if (phase === 'connecting') startHandshake();
    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
    window.addEventListener('keydown', onKeydown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
      window.removeEventListener('keydown', onKeydown);
    };
  });

  // The display keeps its 8:3 shape and scales with the container.
  $effect(() => {
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      scale = Math.min(1, entry.contentRect.width / W);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  });
</script>

<section class="unit" aria-label={ui.unitLabel}>
  <div class="stage" bind:this={stage} style:height="{H * scale}px">
    <div class="bezel" class:connecting={phase === 'connecting'} style:transform="scale({scale})" style:--s={scale}>
      <div class="display">
        {#if ripple}<span class="ripple" aria-hidden="true"></span>{/if}
        {#if phase === 'connecting'}
          <Handshake
            ui={ui.handshake}
            onskip={finishHandshake}
            title={landing === 'off' ? ui.power.goingOff : undefined}
            detail={landing === 'off' ? ui.power.offDetail : undefined}
          />
        {:else if phase === 'off'}
          <Off ui={ui.power} />
        {:else}
          <Dock {data} {screen} {go} />
          {#if screen === 'home'}
            <Home {data} {go} />
          {:else if screen === 'apps'}
            <Apps {data} {go} onback={() => go('home')} />
          {:else if screen === 'experience'}
            <Experience {data} onback={() => go('home')} />
          {:else if screen === 'talks'}
            <Talks {data} onback={() => go('home')} />
          {:else if screen === 'bench'}
            <Bench {data} onback={() => go('home')} />
          {:else if screen === 'about'}
            <About {data} onback={() => go('home')} />
          {/if}
        {/if}
      </div>
    </div>
  </div>

  <div class="controls">
    <nav class="social-links" aria-label={ui.header.navLabel}>
      {#each social as s (s.key)}
        <!-- Mail opens the mail app, so no new tab; it still gets the ↗ so the row matches. -->
        <a href={s.href} target={s.rel ? '_blank' : undefined} rel={s.rel}>
          <Icon name={s.key} width={16} height={16} />
          <span>{s.label}</span>
          <span class="out" aria-hidden="true">↗</span>
        </a>
      {/each}
    </nav>

    <button
      class="power" class:isoff={phase === 'off'} class:nudge type="button"
      onclick={togglePower} onanimationend={() => (nudge = false)} aria-pressed={phase !== 'off'}
    >
      <span class="led" aria-hidden="true"></span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 3v9" /><path d="M6.5 6.8a8 8 0 1 0 11 0" />
      </svg>
      {phase === 'off' ? ui.power.on : ui.power.off}
    </button>
  </div>

  <div class="sr-only" role="status" aria-live="polite">{announce}</div>
</section>

<style>
  .unit { width: 100%; display: flex; flex-direction: column; gap: 14px; }
  .stage { position: relative; width: 100%; max-width: 1322px; margin: 0 auto; overflow: hidden; }
  .bezel {
    position: absolute; left: 0; top: 0; transform-origin: top left;
    box-sizing: content-box; width: 1280px; height: 480px; padding: 20px;
    background: var(--bezel); border: 1px solid var(--bezel-border); border-radius: 30px; overflow: hidden;
    /* Controls keep a 44px on-screen target even when the whole unit is scaled down. */
    --tap: max(44px, calc(44px / var(--s, 1)));
  }
  .display {
    width: 1280px; height: 480px; border-radius: 14px; overflow: hidden; display: flex; position: relative;
    background:
      radial-gradient(900px 420px at 78% -10%, color-mix(in srgb, var(--accent) 9%, transparent), transparent 70%),
      radial-gradient(700px 400px at 8% 110%, color-mix(in srgb, var(--pink) 6%, transparent), transparent 70%),
      var(--display);
  }
  /* Glass: one soft highlight across the top-left, the way a real display catches the cabin light. */
  .display::after {
    content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: 14px; z-index: 3;
    background: linear-gradient(155deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.015) 32%, transparent 55%);
  }

  /* Handshake: a colour sweep glows in the gap around the screen while it connects. */
  .bezel.connecting::before {
    content: ''; position: absolute; inset: 8px; border-radius: 22px; pointer-events: none; z-index: 0;
    background: conic-gradient(from 0deg, var(--accent), var(--pink), var(--amber), var(--ok), var(--accent));
    filter: blur(12px); opacity: 0.75;
    animation: huSpin 2.6s linear infinite;
  }
  .bezel > .display { position: relative; z-index: 1; }

  /* Connected: one ripple sweeps out from the middle, Apple-Intelligence style. */
  .ripple {
    position: absolute; inset: 0; pointer-events: none; z-index: 2; opacity: 0; transform-origin: center;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3), color-mix(in srgb, var(--accent) 35%, transparent) 38%, transparent 62%);
    animation: huRipple 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }

  @keyframes huSpin { to { rotate: 360deg; } }
  @keyframes huRipple {
    0% { opacity: 0; transform: scale(0.2); }
    18% { opacity: 1; }
    100% { opacity: 0; transform: scale(2.8); }
  }
  @media (prefers-reduced-motion: reduce) {
    .bezel.connecting::before { animation: none; opacity: 0.5; }
    .ripple { display: none; }
  }
  .controls {
    width: 100%; max-width: 1322px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  }
  /* A physical key: filled, with a status light that glows while the unit is on. */
  .power {
    display: inline-flex; align-items: center; gap: 8px;
    min-height: 40px; padding: 0 16px 0 14px; border-radius: 999px;
    border: 1px solid var(--pill-border); background: var(--tile); color: var(--text); cursor: pointer;
    font-family: var(--font-sans); font-size: 13px; font-weight: 600;
    transition: color 0.16s ease, background 0.16s ease, border-color 0.16s ease;
  }
  .power:hover { color: var(--text-strong); background: var(--tile-hover); border-color: var(--text); }
  .led {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
    background: var(--ok); box-shadow: 0 0 6px 1px color-mix(in srgb, var(--ok) 70%, transparent);
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
  /* Off: the light turns red, standby style, and the key is the one thing left worth finding. */
  .power.isoff { border-color: var(--text); }
  .power.isoff .led { background: var(--danger); box-shadow: 0 0 6px 1px color-mix(in srgb, var(--danger) 70%, transparent); }

  .power.nudge { animation: power-nudge 1.3s ease-in-out 2; }
  .power.nudge .led { animation: led-flare 1.3s ease-in-out 2; }
  @keyframes power-nudge {
    0%, 100% { box-shadow: 0 0 0 0 transparent; }
    45% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--ok) 22%, transparent), 0 0 18px 2px color-mix(in srgb, var(--ok) 30%, transparent); border-color: var(--ok); }
  }
  @keyframes led-flare {
    0%, 100% { transform: scale(1); }
    45% { transform: scale(1.35); box-shadow: 0 0 10px 3px color-mix(in srgb, var(--ok) 80%, transparent); }
  }
  @media (prefers-reduced-motion: reduce) {
    .power.nudge, .power.nudge .led { animation: none; }
  }
</style>
