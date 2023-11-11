<script lang="ts">
  import 'ionic-svelte/components/ion-button';
  import 'ionic-svelte/components/ion-content';
  import 'ionic-svelte/components/ion-header';
  import 'ionic-svelte/components/ion-item';
  import 'ionic-svelte/components/ion-list';
  import 'ionic-svelte/components/ion-menu';
  import 'ionic-svelte/components/ion-split-pane';

  import { scale } from 'svelte/transition';
  import { activeSessionStore } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import SessionSwitcher from '$lib/client/components/session-switcher.svelte';
  import { fragmentParam } from '$lib/client/components/url-state';

  const idParam = fragmentParam('id');

  function manageIdentity(id: string): void {
    idParam.set(id);
    goto(`/session/identity/manage${$page.url.hash}`);
  }
</script>

<ion-split-pane content-id="main">
  <ion-menu content-id="main">
    <ion-header class="ion-padding">
      <SessionSwitcher />
      <ion-button
        class="ion-margin-top"
        expand="block"
        href={`/session/identity/create${$page.url.hash}`}>Create Identity</ion-button
      >
      <ion-button
        class="ion-margin-top"
        expand="block"
        href={`/session/identity/import${$page.url.hash}`}>Import Identity</ion-button
      >
    </ion-header>
    <ion-content class="ion-padding">
      {#if $activeSessionStore?.identities}
        {#each $activeSessionStore.identities as id}
          <ion-list>
            <ion-item>{id}</ion-item>
          </ion-list>
          <button on:click={() => manageIdentity(id)} in:scale>
            {id}
          </button>
        {/each}
      {/if}
    </ion-content>
  </ion-menu>

  <div id="main" style="display:contents">
    <slot />
  </div>
</ion-split-pane>

<style>
  ion-header :global(label) {
    margin-bottom: 48px;
  }
</style>
