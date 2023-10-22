<script lang="ts">
  import { getIdentity } from 'trusync-svelte';
  import SessionSwitcher from './session-switcher.svelte';

  const identity = getIdentity();
</script>

<SessionSwitcher />

{#if $identity.importedAddresses.length}
  <nav>
    <header>
      <a href="/identity/import">Import</a>
      <a href="/identity/create">Create</a>
    </header>
    {#each $identity.importedAddresses as key}
      <a href={`/identity/manage/${key}`}>{key.length > 24 ? `${key.slice(0, 24)}...` : key}</a>
    {/each}
  </nav>
{/if}

<main style="padding: 24px">
  <slot />
</main>
