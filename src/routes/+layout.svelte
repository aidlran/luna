<script>
  import { indexeddb } from '@astrobase/core/indexeddb';
  import { clients } from '@astrobase/core/rpc/client';
  import '$lib/client/styles/main.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>LUNA Project Management</title>
  <meta name="description" content="LUNA: productivity and project management system." />
</svelte:head>

{#await indexeddb().then((strategy) => clients.add({ strategy })) then}
  {@render children()}
{/await}
