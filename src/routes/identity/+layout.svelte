<script lang="ts">
  import { getIdentity } from 'trusync-svelte';
  import SessionSwitcher from './session-switcher.svelte';
  const identity = getIdentity();
</script>

<div class="layout">
  <SessionSwitcher />

  <div style="display: flex; margin-top: var(--padding);">
    {#if $identity.importedAddresses.length}
      <nav style="max-width: 240px;">
        <header>
          <a href="/identity/import">Import</a>
          <a href="/identity/create/identity">Create</a>
        </header>
        {#each $identity.importedAddresses as key}
          <a href={`/identity/manage/${key}`}>{key.length > 24 ? `${key.slice(0, 24)}...` : key}</a>
        {/each}
      </nav>
    {/if}

    <main style="width: 100%;">
      <slot />
    </main>
  </div>
</div>

<style>
  .layout {
    --padding: 24px;
    margin: auto;
    max-width: 960px;
    padding: var(--padding);
  }
</style>
