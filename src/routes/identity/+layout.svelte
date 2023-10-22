<script lang="ts">
  import { getIdentity } from 'trusync-svelte';
  import SessionSwitcher from './session-switcher.svelte';
  const identity = getIdentity();
</script>

<div class="layout flex">
  <nav style="max-width: 240px;">
    <header>
      <SessionSwitcher />
      <div class="flex">
        <a href="/identity/import">Import</a>
        <a href="/identity/create/identity">Create</a>
      </div>
    </header>
    {#each $identity.importedAddresses as key}
      <div>
        <a href={`/identity/manage/${key}`}>
          {key.length > 24 ? `${key.slice(0, 24)}...` : key}
        </a>
      </div>
    {/each}
  </nav>

  <main style="width: 100%;">
    <slot />
  </main>
</div>

<style>
  .layout {
    --padding: 24px;
    max-width: 960px;
    margin: auto;
    padding: var(--padding);
  }

  .flex {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    gap: var(--padding);
  }

  a {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  nav {
    min-width: 180px;
    max-width: 240px;
  }
</style>
