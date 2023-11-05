<script>
  import { activeSessionStore } from 'trusync-svelte';
  import { page } from '$app/stores';
</script>

<h1>Identity & Session Manager</h1>

{#if $activeSessionStore?.identities.size}
  <p>Use the menu to manage your imported identities.</p>
{:else}
  <p>Generate an identity now to get started, or import an existing identity.</p>
{/if}

<ul>
  <li><a href={`create${$page.url.hash}`}>Create a session</a></li>
  <li><a href={`identity/create${$page.url.hash}`}>Create an identity</a></li>
  <li><a href={`identity/import${$page.url.hash}`}>Import an identity</a></li>
</ul>
