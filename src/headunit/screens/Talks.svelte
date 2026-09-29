<script lang="ts">
  // A talk with a `youtube` id plays here, on the page. Nothing from YouTube loads until
  // the play button is pressed: the poster is our own image, and the embed uses the
  // no-cookie host. A talk with only a `video` link still links out.
  import type { SiteData } from '../../lib/types';
  import ScreenHeader from '../ScreenHeader.svelte';
  import Todo from '../Todo.svelte';

  let { data, onback }: { data: SiteData; onback: () => void } = $props();
  const app = $derived(data.apps.find((a) => a.id === 'talks')!);
  const labels = $derived(data.ui.screens.talks);

  let playing = $state<string | null>(null);
</script>

<div class="screen hu-enter">
  <ScreenHeader title={app.label} backLabel={data.ui.dock.back} {onback} />
  <div class="list">
    <!-- A placeholder talk is a dev-only reminder: in production it renders nothing at all. -->
    {#each data.talks.filter((t) => t.title || import.meta.env.DEV) as talk, i (i)}
      {#if talk.title}
        <div class="talk" class:wide={playing === talk.title}>
          {#if playing === talk.title && talk.youtube}
            <div class="player">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${talk.youtube}?autoplay=1&rel=0&modestbranding=1`}
                title={talk.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          {:else}
            {#if talk.youtube}
              <button class="poster" type="button" onclick={() => (playing = talk.title!)} aria-label={`${labels.play}: ${talk.title}`}>
                {#if talk.image}<img src={talk.image} alt="" width="144" height="82" loading="lazy" decoding="async" />{/if}
                <span class="play" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
                </span>
              </button>
            {:else if talk.image}
              <img class="thumb" src={talk.image} width="144" height="82" alt="" loading="lazy" decoding="async" />
            {/if}

            <div class="text">
              <span class="kicker">{talk.year}</span>
              <span class="title">{talk.title}</span>
              <span class="meta">{talk.event}</span>
            </div>

            {#if talk.youtube}
              <button class="video" type="button" onclick={() => (playing = talk.title!)}>{labels.play} ▸</button>
            {:else if talk.video}
              <a class="video" href={talk.video} target="_blank" rel="noopener noreferrer">{labels.video}</a>
            {/if}
          {/if}
        </div>
      {:else}
        <Todo items={talk.todos} />
      {/if}
    {/each}
  </div>
</div>

<style>
  .screen { flex-grow: 1; min-width: 0; box-sizing: border-box; padding: 28px 40px; display: flex; flex-direction: column; gap: 18px; }
  .list { display: flex; flex-direction: column; gap: 12px; min-height: 0; flex-grow: 1; }
  .talk {
    display: flex; align-items: center; gap: 20px; border-radius: 18px; background: var(--tile); padding: 20px 24px;
  }
  .talk.wide { flex-grow: 1; padding: 12px; }

  .player { width: 100%; height: 100%; min-height: 240px; border-radius: 12px; overflow: hidden; background: #000; }
  .player iframe { width: 100%; height: 100%; min-height: 240px; border: 0; display: block; }

  .poster {
    position: relative; width: 144px; height: 82px; flex-shrink: 0; padding: 0; border: 1px solid var(--divider);
    border-radius: 10px; overflow: hidden; background: var(--surface-2); cursor: pointer;
  }
  .poster img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .play {
    position: absolute; inset: 0; margin: auto; width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; color: #fff;
    background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(6px);
  }
  .thumb { width: 144px; height: 82px; border-radius: 10px; object-fit: cover; border: 1px solid var(--divider); flex-shrink: 0; }

  .text { display: flex; flex-direction: column; gap: 4px; margin-right: auto; }
  .kicker { font-family: var(--font-mono); font-size: 12px; color: var(--muted); text-transform: uppercase; }
  .title { font-size: 19px; font-weight: 600; }
  .meta { font-size: 14px; color: var(--muted); }

  .video {
    display: inline-flex; align-items: center; justify-content: center; min-width: var(--tap); min-height: var(--tap);
    padding: 0 14px; border: 1px solid var(--pill-border); border-radius: 999px; background: transparent;
    font-family: var(--font-sans); font-size: 14px; font-weight: 600; color: var(--text); text-decoration: none; cursor: pointer;
  }
  .video:hover { background: var(--tile-hover); }
</style>
