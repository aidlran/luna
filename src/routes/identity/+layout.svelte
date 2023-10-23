<script lang="ts">
  import { scale } from 'svelte/transition';
  import { getIdentity } from 'trusync-svelte';
  import SessionSwitcher from './session-switcher.svelte';
  const identity = getIdentity();
</script>

<div class="layout">
  <div>
    <nav>
      <SessionSwitcher />
      <h1>Session Identities</h1>
      <div class="buttons">
        <a href="/identity/import">Import</a>
        <a href="/identity/create/identity">Create</a>
      </div>
      {#each $identity.importedAddresses as key}
        <a href={`/identity/manage/${key}`} in:scale>
          {key}
        </a>
      {/each}
    </nav>
  </div>

  <main>
    <slot />
  </main>
</div>

<style>
  .layout {
    --padding: 20px;
    --section-padding: calc(var(--padding) * 2) var(--padding);
    margin: auto;
    display: flex;
    max-width: 960px;
  }

  main {
    width: 100%;
    padding: var(--section-padding);
    border-left: 1px solid var(--colour-border);
  }

  nav {
    position: sticky;
    top: 0;
    height: calc(100vh - calc(var(--padding) * 4));
    width: 280px;
    padding: var(--section-padding);
    border-right: 1px solid var(--colour-border);
    overflow-y: auto;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    gap: var(--padding);
  }

  h1 {
    font-size: 1em;
    margin: 74px 0 0;
  }

  a {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    border: 1px solid var(--colour-border);
    border-radius: 4px;
    padding: 12px 4px;
    margin-top: var(--padding);
  }

  .buttons a {
    flex-grow: 1;
    text-align: center;
  }
</style>
