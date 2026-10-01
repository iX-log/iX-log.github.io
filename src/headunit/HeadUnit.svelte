<script lang="ts">
  import { onMount } from 'svelte';
  import type { SiteData } from '../lib/types';
  import Unit from './Unit.svelte';
  import Companion from './Companion.svelte';
  import './headunit.css';

  let { data }: { data: SiteData } = $props();

  // This component only ever runs client-side (client:only="svelte"), so window is always
  // there: read the real width up front instead of defaulting to one shell and flashing the other.
  let wide = $state(matchMedia('(min-width: 768px)').matches);
  onMount(() => {
    const query = matchMedia('(min-width: 768px)');
    const update = (e: MediaQueryListEvent) => (wide = e.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  });
</script>

{#if wide}
  <Unit {data} />
{:else}
  <Companion {data} />
{/if}
