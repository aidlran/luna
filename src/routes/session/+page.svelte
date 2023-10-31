<script>
  import { activeSessionStore } from 'trusync-svelte';
</script>

<h1>Identity & Session Manager</h1>

{#if $activeSessionStore?.identities.size}
  <p>Use the menu to manage your imported identities.</p>
{:else}
  <p>Generate an identity now to get started, or import an existing identity.</p>
{/if}

<ul>
  <li><a href="create">Create a session</a></li>
  <li><a href="identity/create">Create an identity</a></li>
  <li><a href="identity/import">Import an identity</a></li>
</ul>
