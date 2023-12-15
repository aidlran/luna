<script lang="ts">
  import 'ionic-svelte/components/ion-card';
  import 'ionic-svelte/components/ion-card-content';
  import 'ionic-svelte/components/ion-card-header';
  import 'ionic-svelte/components/ion-card-title';
  import { onDestroy } from 'svelte';
  import { session } from 'trusync';
  import { activeSession } from 'trusync-svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Header from '$lib/client/components/header/header.svelte';
  import { fragmentParam } from '$lib/client/components/url-state';

  const activeSessionStore = activeSession();
  const idParam = fragmentParam('id');

  $: if (browser && (!$idParam || !$activeSessionStore?.identities.has($idParam))) {
    goto(`../${$page.url.hash}`);
  }

  onDestroy(() => browser && idParam.set(undefined));

  // TODO: "Are you sure?" modal on forget
  function forget(): void {
    session().forgetIdentity($idParam as string);
  }
</script>

<Header activeApp="sessions" backHref={`../${$page.url.hash}`}>
  <ion-title>Manage identity</ion-title>
</Header>

<ion-content>
  <ion-card class="ion-margin">
    <ion-card-header>
      <ion-card-title>Address</ion-card-title>
      <ion-card-subtitle>
        This is the identity's public address. It is derived from the public keys associated with
        the identity.
      </ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <code>{$idParam}</code>
    </ion-card-content>
  </ion-card>

  <ion-card class="ion-margin">
    <ion-card-header>
      <ion-card-title color="danger">Forget identity</ion-card-title>
      <ion-card-subtitle>
        <strong>Read carefully before proceeding.</strong>
      </ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <p>
        <span>
          Forgetting this identity will remove its private keys from this client. It will no longer
          be usable until you import it again. It will only be removed locally. If has been imported
          in another client, it will still be available there. No graph data will be deleted.
        </span>
        <strong>Ensure you have a recovery method ready or you will be locked out forever.</strong>
        <span>No data will be directly deleted by this action.</span>
      </p>
    </ion-card-content>
    <ion-button
      class="ion-margin"
      role="button"
      tabindex="0"
      color="danger"
      fill="outline"
      on:keypress
      on:click={forget}>Forget identity</ion-button
    >
  </ion-card>
</ion-content>
