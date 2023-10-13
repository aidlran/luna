<script>
  import { getIdentity } from 'trusync-svelte';
  const identity = getIdentity();
</script>

{#if $identity.importedAddresses.length}
  <p>Use the menu to manage your imported identities.</p>
{:else}
  <h1>Let's get started.</h1>
  <p>Generate an identity now to get started, or import an existing identity.</p>
{/if}

<a href="create"> Create an identity </a>

<a href="import"> Import an identity </a>
