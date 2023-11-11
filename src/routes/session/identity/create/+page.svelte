<script lang="ts">
  import { base58, generateIdentity, importIdentity } from 'trusync';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import PageHeader from '$lib/client/components/page-header.svelte';
  import { fragmentParam } from '$lib/client/components/url-state';

  const idParam = fragmentParam('id');
</script>

<PageHeader backHref={`../${$page.url.hash}`}>
  <ion-title>Create an identity</ion-title>
</PageHeader>

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
