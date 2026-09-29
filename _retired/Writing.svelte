<script lang="ts">
  import type { SiteData } from '../../lib/types';
  import { formatDate } from '../../lib/format';
  import ScreenHeader from '../ScreenHeader.svelte';

  let { data, onback }: { data: SiteData; onback: () => void } = $props();
</script>

<div class="screen hu-enter">
  <ScreenHeader title={data.writing.title} subtitle={data.writing.summary} backLabel={data.ui.dock.back} {onback} />
  <div class="cards">
    {#each data.posts as post, i (post.url)}
      <a class="card" href={post.url}>
        <span class="cover" aria-hidden="true">
          <span class="num">{String(i + 1).padStart(2, '0')}</span>
          <span class="rule"></span>
        </span>
        <span class="kicker">{post.kicker ?? post.part}</span>
        <span class="title">{post.title}</span>
        <span class="meta">{post.blurb}<br />{formatDate(post.date)} · {post.minutes} {data.ui.screens.writing.minutes}</span>
      </a>
    {/each}
  </div>
</div>

<style>
  .screen { flex-grow: 1; min-width: 0; box-sizing: border-box; padding: 28px 40px; display: flex; flex-direction: column; gap: 22px; }
  .cards { flex-grow: 1; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
  .card { text-decoration: none; border-radius: 18px; background: var(--tile); padding: 18px 22px 22px; display: flex; flex-direction: column; gap: 10px; color: var(--text); }
  .cover {
    height: 76px; margin-bottom: 4px; border-radius: 12px; background: var(--surface-2);
    display: flex; align-items: flex-end; gap: 12px; padding: 0 14px 10px; overflow: hidden;
  }
  .num { font-family: var(--font-mono); font-size: 40px; line-height: 0.9; color: var(--accent); opacity: 0.32; }
  .rule { flex-grow: 1; height: 3px; margin-bottom: 8px; border-radius: 2px; background: var(--divider); }
  .card:hover .rule { background: var(--accent); }
  .meta { margin-top: auto; }
  .card:hover { background: var(--tile-hover); }
  .kicker { font-family: var(--font-mono); font-size: 12px; color: var(--accent); text-transform: uppercase; }
  .title { font-size: 20px; font-weight: 600; line-height: 1.2; }
  .meta { font-size: 13px; color: var(--muted); }
</style>
