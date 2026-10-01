<script lang="ts">
  // The screen the unit shows when it's switched off: Logan, whole, at the display's own 8:3,
  // under the same glass bar the dashboard tile uses.
  import type { Ui } from '../lib/types';

  let { ui }: { ui: Ui['power'] } = $props();
</script>

<div class="off hu-enter">
  <h2 class="sr-only" tabindex="-1" data-focus-target>{ui.offTitle}</h2>
  <img src="/img/logan.webp" alt={ui.photoAlt} width="1600" height="600" loading="lazy" decoding="async" />
  <span class="foot" aria-hidden="true">{ui.offTitle}</span>
</div>

<style>
  .off { position: absolute; inset: 0; overflow: hidden; background: #000; }
  /* Dimmed: the unit is off, so the picture sits back a little. */
  .off img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }

  /* Same bar as the dashboard's portrait tile — same fill, blur, radius and type. */
  .foot {
    position: absolute; right: 16px; bottom: 16px; border-radius: 16px; padding: 12px 18px;
    background: rgba(12, 12, 14, 0.66);
    backdrop-filter: blur(22px) saturate(150%);
    -webkit-backdrop-filter: blur(22px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 8px 26px rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.82); font-size: 13px; font-weight: 600;
  }
</style>
