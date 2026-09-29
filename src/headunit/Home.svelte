<script lang="ts">
  // The dashboard: the portrait fills the wide panel and opens the CV; two glass cards
  // beside it carry the current role and the latest post. Everything else is an app.
  import type { Screen, SiteData } from '../lib/types';
  import Icon from './Icon.svelte';
  import Todo from './Todo.svelte';

  let { data, go }: { data: SiteData; go: (s: Screen) => void } = $props();
  const ui = $derived(data.ui);
  const home = $derived(ui.home);
  // posts are sorted oldest first, so the newest is last
  const latest = $derived(data.posts[data.posts.length - 1]);
  const lead = $derived(data.roles[0]);
  const app = $derived((id: string) => data.apps.find((a) => a.id === id)!);
  // The talk card wants something you can actually watch; placeholders stay out.
  const talk = $derived(data.talks.find((t) => t.title && t.video));
</script>

<div class="home hu-enter">
  <h2 class="sr-only" tabindex="-1" data-focus-target>{home.title}</h2>

  <!-- Wide panel: the portrait, opening the CV. A real <a> once the PDF exists, a button until then. -->
  {#snippet stageInner()}
    <img src="/img/dashboard.webp" alt={home.photoAlt} width="1600" height="1153" fetchpriority="high" decoding="async" />
    <span class="veil" aria-hidden="true"></span>

    <!-- No PDF yet, so nothing on the tile promises one. Add cvUrl and the badge returns. -->
    {#if data.cvUrl}
      <span class="badge glass">
        <Icon name="cv" width={16} height={16} />
        {home.cvLead}
      </span>
    {/if}

    <span class="stage-foot glass">
      <span class="sf-text">
        <span class="sf-title">{home.stageTitle}</span>
      </span>
      <span class="sf-cta">{data.cvUrl ? ui.boring.cv : home.aboutCta}</span>
    </span>
  {/snippet}

  {#if data.cvUrl}
    <a class="stage hu-tile" href={data.cvUrl}>{@render stageInner()}</a>
  {:else}
    <button class="stage hu-tile" type="button" onclick={() => go('about')}>{@render stageInner()}</button>
  {/if}

  <!-- Glass column -->
  <div class="stack">
    <button class="card glass hu-tile" type="button" onclick={() => go('experience')}>
      <span class="ic"><Icon name="car" width={24} height={22} /></span>
      <span class="words">
        <span class="c-title">{lead.project}</span>
        <span class="c-meta">{lead.title} · {lead.start} – {lead.end}</span>
      </span>
    </button>

    <a class="card glass hu-tile" href={latest.url} target="_blank" rel="noopener noreferrer">
      <span class="ic"><Icon name={app('writing').icon} width={22} height={22} /></span>
      <span class="words">
        <span class="c-title">{latest.title}</span>
        <span class="c-meta">{ui.widgets.latest} · {latest.minutes} {ui.screens.writing.minutes}</span>
      </span>
    </a>

    {#if talk}
      <a class="card glass hu-tile" href={talk.video} target="_blank" rel="noopener noreferrer">
        <span class="ic"><Icon name={app('talks').icon} width={22} height={22} /></span>
        <span class="words">
          <span class="c-title">{talk.title}</span>
          <span class="c-meta">{talk.event} · {ui.screens.talks.video}</span>
        </span>
      </a>
    {:else}
      <button class="card glass hu-tile" type="button" onclick={() => go('talks')}>
        <span class="ic"><Icon name={app('talks').icon} width={22} height={22} /></span>
        <span class="words"><span class="c-title">{app('talks').label}</span><span class="c-meta">{app('talks').hint}</span></span>
      </button>
    {/if}
  </div>

  <Todo items={[...home.todos, ...(data.cvUrl ? [] : data.profileTodos)]} />
</div>

<style>
  .home { flex-grow: 1; min-width: 0; box-sizing: border-box; padding: 26px 28px; display: flex; gap: 18px; position: relative; }

  /* Liquid glass: translucent fill, blurred backdrop, a light top edge. */
  .glass {
    background: color-mix(in srgb, var(--tile) 55%, transparent);
    backdrop-filter: blur(22px) saturate(150%);
    -webkit-backdrop-filter: blur(22px) saturate(150%);
    border: 1px solid color-mix(in srgb, var(--text) 12%, transparent);
    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text) 14%, transparent), 0 8px 26px rgba(0, 0, 0, 0.26);
  }

  .stage {
    position: relative; flex-grow: 1; min-width: 0; padding: 0; border: none; border-radius: 22px; overflow: hidden;
    cursor: pointer; font-family: inherit; text-align: left; color: var(--text); background: var(--tile); display: block;
  }
  /* The source carries headroom above his head; whatever the tile's aspect turns out to be,
     the crop is biased upward so it eats floor rather than forehead. */
  .stage img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 26%; }
  .veil {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.14) 0%, rgba(0, 0, 0, 0) 38%, rgba(0, 0, 0, 0.58) 100%);
  }

  .badge {
    position: absolute; top: 16px; left: 16px; display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 999px; color: #fff;
    font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
  }

  /* These two sit on the photo, not on the theme, so they stay dark in day mode too. */
  .badge,
  .stage-foot {
    background: rgba(12, 12, 14, 0.66);
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 8px 26px rgba(0, 0, 0, 0.3);
  }

  .stage-foot {
    position: absolute; left: 16px; right: 16px; bottom: 16px; border-radius: 16px; padding: 12px 18px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px; color: #fff;
  }
  .sf-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  /* Same weight, size and opacity as the CTA opposite it. */
  .sf-title { font-size: 13px; font-weight: 600; color: rgba(255, 255, 255, 0.82); }
  .sf-cta { font-size: 13px; font-weight: 600; flex-shrink: 0; color: rgba(255, 255, 255, 0.82); }

  .stack { width: 330px; flex-shrink: 0; display: flex; flex-direction: column; gap: 14px; }
  .card {
    flex: 1; border-radius: 20px; padding: 16px 18px; display: flex; align-items: center; gap: 14px;
    cursor: pointer; font-family: inherit; text-align: left; color: var(--text); text-decoration: none; border-width: 1px;
  }
  .ic {
    width: 44px; height: 44px; flex-shrink: 0; border-radius: 13px; display: flex; align-items: center; justify-content: center;
    background: color-mix(in srgb, var(--text) 10%, transparent); color: var(--text);
  }
  .words { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .c-title { font-size: 19px; font-weight: 600; line-height: 1.2; }
  .c-meta { font-size: 13px; color: var(--muted); }
</style>
