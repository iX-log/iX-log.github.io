<script lang="ts">
  // Same visible marker as components/Todo.astro (.todo lives in styles/global.css).
  let { items = [] }: { items?: string[] } = $props();
</script>

{#if import.meta.env.DEV}
  {#each items as text}
    <div><span class="todo">TODO: {text}</span></div>
  {/each}
{/if}
