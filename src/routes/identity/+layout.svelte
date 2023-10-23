<script lang="ts">
  import { getIdentity } from 'trusync-svelte';
  import SessionSwitcher from './session-switcher.svelte';
  const identity = getIdentity();
</script>

<div class="layout">
  <nav>
    <SessionSwitcher />
    <section>
      <h1 style:padding-top="26px">Identity</h1>
      <div class="buttons">
        <a href="/identity/import">Import</a>
        <a href="/identity/create/identity">Create</a>
      </div>
    </section>
    {#if !!$identity.importedAddresses.length}
      <section>
        <h1>Imported identities</h1>
        {#each $identity.importedAddresses as key}
          <a href={`/identity/manage/${key}`}>
            {key}
          </a>
        {/each}
      </section>
    {/if}
  </nav>

  <main>
    <slot />
  </main>
</div>

<style>
  .layout {
    --padding: 20px;
    margin: auto;
    display: flex;
    max-width: 960px;
    padding: calc(var(--padding) * 2) var(--padding);
  }

  .layout > * {
    padding: 0 var(--padding);
  }

  main {
    width: 100%;
    border-left: 1px solid var(--colour-border);
  }

  nav {
    --width: 280px;
    min-width: var(--width);
    width: var(--width);
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    gap: var(--padding);
  }

  h1 {
    font-size: 1em;
    margin: calc(var(--padding) * 2) 0 7px;
  }

  a {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    border: 1px solid var(--colour-border);
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 14px;
  }

  .buttons a {
    flex-grow: 1;
    text-align: center;
    margin-bottom: 0;
  }
</style>
