<script lang="ts">
  import 'ionic-svelte/components/ion-button';
  import 'ionic-svelte/components/ion-content';
  import 'ionic-svelte/components/ion-footer';
  import 'ionic-svelte/components/ion-header';
  import 'ionic-svelte/components/ion-label';
  import 'ionic-svelte/components/ion-item';
  import 'ionic-svelte/components/ion-list';
  import 'ionic-svelte/components/ion-title';
  import 'ionic-svelte/components/ion-toolbar';

  import { add, duplicate } from 'ionicons/icons';
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

<ion-header>
  <ion-toolbar>
    <ion-title>Identities</ion-title>
    <ion-buttons slot="end">
      <ion-button href={`/session/identity/import${$page.url.hash}`} title="Import identity">
        <ion-icon icon={duplicate}></ion-icon>
      </ion-button>
      <ion-button href={`/session/identity/create${$page.url.hash}`} title="Create identity">
        <ion-icon icon={add}></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  {#if $activeSessionStore?.identities.size}
    <ion-list>
      {#each $activeSessionStore.identities as id}
        <ion-item
          role="button"
          tabindex="0"
          button={true}
          detail={true}
          href={`/session/identity/manage${$page.url.hash}`}
          on:click|preventDefault={() => manageIdentity(id)}
          on:keypress|preventDefault={() => manageIdentity(id)}
        >
          <ion-label>{id}</ion-label>
        </ion-item>
      {/each}
    </ion-list>
  {/if}
</ion-content>
<ion-footer class="narrow-only">
  <ion-toolbar class="ion-padding" style:--ion-padding="7px">
    <SessionSwitcher />
  </ion-toolbar>
</ion-footer>
