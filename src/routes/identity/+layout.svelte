<script lang="ts">
  import { getIdentity } from 'trusync-svelte';

  const identity = getIdentity();

  function getShortKey(key: string) {
    if (key.length < 24) {
      return key;
    } else {
      return `${key.slice(0, 24)}...`;
    }
  }
</script>

<main>
  {#if $identity.importedAddresses.length}
    <nav>
      <header>
        <a href="/identity/import">Import</a>
        <a href="/identity/create">Create</a>
      </header>
      {#each $identity.importedAddresses as key}
        <a href={`/identity/manage/${key}`}>{getShortKey(key)}</a>
      {/each}
    </nav>
  {/if}
  <section>
    <slot />
  </section>
</main>

<style>
  main {
    display: flex;
  }

  nav {
    width: 300px;
  }
</style>
