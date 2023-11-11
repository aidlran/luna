<script lang="ts">
  import { chevronBack } from 'ionicons/icons';
  import { base58, generateIdentity, importIdentity } from 'trusync';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fragmentParam } from '$lib/client/components/url-state';
  const idParam = fragmentParam('id');
</script>

<ion-header>
  <ion-toolbar>
    <ion-title>Create an identity</ion-title>
    <ion-buttons slot="start">
      <ion-button href={`../${$page.url.hash}`}>
        <ion-icon icon={chevronBack} />
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  {#await generateIdentity() then identity}
    <p>
      <span>Your address:</span>
      <code>{identity.address.value}</code>
    </p>
    <p>
      <span>Your recovery code:</span>
      <code>{base58.encode(identity.secret)}</code>
    </p>
    <ion-button
      role="button"
      tabindex="0"
      on:keypress
      on:click={() =>
        importIdentity(identity.address.value, identity.secret, () => {
          idParam.set(identity.address.value);
          goto(`manage${$page.url.hash}`);
        })}>Continue</ion-button
    >
  {/await}
</ion-content>
