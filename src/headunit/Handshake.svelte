<script lang="ts">
  import type { Ui } from '../lib/types';
  import Icon from './Icon.svelte';

  // `title`/`detail` let the power-off sweep reuse this screen with its own words.
  let { ui, onskip, title, detail }: { ui: Ui['handshake']; onskip: () => void; title?: string; detail?: string } = $props();
</script>

<!-- One real button: click, Enter or Space skips. Escape also skips (handled on the window). -->
<button class="connecting hu-enter" type="button" onclick={onskip}>
  <span class="row">
    <Icon name="phone" width={44} height={44} stroke={1.5} />
    <span class="dots" aria-hidden="true">
      <span class="dot hu-dot"></span><span class="dot hu-dot hu-dot2"></span><span class="dot hu-dot hu-dot3"></span>
    </span>
    <Icon name="car" width={52} height={44} stroke={1.5} />
  </span>
  <span class="text">
    <span class="title">{title ?? ui.title}</span>
    <span class="detail">{detail ?? ui.detail}</span>
  </span>
  <span class="sr-only">{ui.skipHint}</span>
</button>

<style>
  .connecting {
    position: absolute; inset: 0; border: none; padding: 0; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px;
    background: var(--display); color: var(--text); font-family: inherit;
  }
  .connecting:focus-visible { outline: 2px solid var(--accent); outline-offset: -8px; }
  .row { display: flex; align-items: center; gap: 22px; }
  .dots { display: flex; gap: 8px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
  .text { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .title { font-size: 26px; font-weight: 600; font-stretch: 112%; }
  .detail { font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
</style>
