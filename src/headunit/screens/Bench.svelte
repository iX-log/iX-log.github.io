<script lang="ts">
  import type { SiteData } from '../../lib/types';
  import ScreenHeader from '../ScreenHeader.svelte';
  import Todo from '../Todo.svelte';

  let { data, onback }: { data: SiteData; onback: () => void } = $props();
  const bench = $derived(data.bench);
  const chart = $derived(bench.chart);
  const questions = $derived(bench.questions);

  // Chart geometry from the mockup: 600 x 240 viewBox, x = seconds, y from the axis labels.
  const X = (t: number) => (t * 600) / chart.duration;
  const Y = (ms: number) => 181 - (ms - chart.low) * (109 / (chart.high - chart.low));
  const line = $derived(chart.points.map(([t, ms]) => `${X(t).toFixed(1)},${Y(ms).toFixed(1)}`).join(' '));
</script>

<div class="screen hu-enter">
  <ScreenHeader title={bench.name} subtitle={bench.context} backLabel={data.ui.dock.back} {onback}>
    {#snippet right()}
      {#if bench.repo}
        <a class="pill" href={bench.repo}>{data.ui.screens.bench.repoLink}</a>
      {:else}
        <Todo items={bench.todos} />
      {/if}
    {/snippet}
  </ScreenHeader>

  <div class="intro">
    <p class="lead">{questions.lead}</p>
    <ul class="questions">
      {#each questions.items as q (q.label)}
        <li><span class="q-label">{q.label}</span> {q.text}</li>
      {/each}
    </ul>
    <p class="answer">{questions.answer}</p>
  </div>

  <div class="body">
    <div class="readouts">
      {#each bench.readouts as r (r.label)}
        <div class="readout">
          <span class="value" class:accent={r.accent}>{r.value}<span class="unit">{r.unit}</span></span>
          <span class="note">{r.display}</span>
        </div>
      {/each}
    </div>

    <div class="chart">
      <div class="chart-head"><span>{chart.label}</span><span>{chart.unit}</span></div>
      <svg viewBox="0 0 600 240" width="100%" height="220" role="img" aria-label={chart.alt}>
        <line x1="0" y1="190" x2="600" y2="190" stroke="var(--divider)" stroke-width="1" />
        <line x1="0" y1="120" x2="600" y2="120" stroke="var(--divider)" stroke-width="1" />
        <line x1="0" y1="50" x2="600" y2="50" stroke="var(--divider)" stroke-width="1" />
        <line x1={X(chart.stepAt)} y1="10" x2={X(chart.stepAt)} y2="230" stroke="var(--amber)" stroke-width="1" stroke-dasharray="4 4" />
        <polyline fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" points={line} />
        <text x={X(chart.stepAt) + 8} y="28" fill="var(--amber)" font-family="Geist Mono, monospace" font-size="12">{chart.stepLabel}</text>
        <text x="6" y={Y(chart.low) + 25} fill="var(--muted)" font-family="Geist Mono, monospace" font-size="11">{chart.low}</text>
        <text x="560" y={Y(chart.high) + 22} fill="var(--muted)" font-family="Geist Mono, monospace" font-size="11">{chart.high}</text>
      </svg>
    </div>
  </div>
</div>

<style>
  .screen { flex-grow: 1; min-width: 0; box-sizing: border-box; padding: 28px 40px; display: flex; flex-direction: column; gap: 18px; }
  .pill {
    display: inline-flex; align-items: center; min-height: var(--tap); box-sizing: border-box;
    font-size: 14px; padding: 10px 16px; border: 1px solid var(--pill-border); border-radius: 999px; text-decoration: none; color: var(--text);
  }
  .intro { display: flex; flex-direction: column; gap: 8px; }
  .lead { margin: 0; font-size: 14px; color: var(--text); }
  .questions {
    list-style: none; margin: 0; padding: 0;
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px;
  }
  .questions li { font-size: 13px; color: var(--muted); line-height: 1.35; }
  .q-label { display: block; color: var(--text); font-weight: 600; }
  .answer { margin: 0; font-size: 12px; color: var(--muted); }
  .body { flex-grow: 1; display: flex; gap: 20px; min-height: 0; }
  .readouts { width: 420px; flex-shrink: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .readout { border-radius: 16px; background: var(--tile); padding: 18px; display: flex; flex-direction: column; justify-content: space-between; }
  .value { font-family: var(--font-mono); font-size: 32px; font-weight: 500; }
  .value.accent { color: var(--accent); }
  .unit { font-size: 16px; color: var(--muted); }
  .note { font-size: 13px; color: var(--muted); }
  .chart { flex-grow: 1; min-width: 0; border-radius: 16px; background: var(--tile); padding: 18px 20px; display: flex; flex-direction: column; gap: 8px; }
  .chart-head { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 12px; color: var(--muted); text-transform: uppercase; }
</style>
