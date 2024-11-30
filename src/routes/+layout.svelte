<script>
  import { indexeddb } from '@astrobase/core/indexeddb';
  import { clients } from '@astrobase/core/rpc/client';
  import { page } from '$app/stores';
  import '$lib/client/styles/main.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>LUNA Project Management</title>
  <meta name="description" content="LUNA: productivity and project management system." />
</svelte:head>

<header class="border">
  {#each [['/', 'Tasks'], ['/settings', 'Settings']] as [path, text]}
    <a class="button" class:text-blue-700={$page.url.pathname === path} href={path}>{text}</a>
  {/each}
</header>

{#await indexeddb().then((strategy) => clients.add({ strategy })) then}
  {@render children()}
{/await}
