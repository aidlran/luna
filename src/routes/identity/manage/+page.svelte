<script>
  import { getIdentity } from 'trusync-svelte';
  const identity = getIdentity();
</script>

<h1>Identity & Session Manager</h1>

{#if !!$identity.importedAddresses.length}
  <p>Use the menu to manage your imported identities.</p>
{:else}
  <p>Generate an identity now to get started, or import an existing identity.</p>
{/if}

<ul>
  <li><a href="create/session">Create a session</a></li>
  <li><a href="create/identity">Create an identity</a></li>
  <li><a href="import">Import an identity</a></li>
</ul>
