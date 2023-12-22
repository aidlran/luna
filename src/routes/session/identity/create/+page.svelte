<script lang="ts">
  import { base58, identity, session } from 'trusync';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Header from '$lib/client/components/header/header.svelte';
  import { fragmentParam } from '$lib/client/components/url-state';

  const idParam = fragmentParam('id');
</script>

<Header activeApp="sessions" backHref={`../${$page.url.hash}`} title="Create an identity" />

<ion-content class="ion-padding">
  {#await identity().generate() then { secret, identity }}
    {#if identity.value}
      <p>
        <span>Your address:</span>
        <code>{identity.value.address.value}</code>
      </p>
      <p>
        <span>Your recovery code:</span>
        <code>{base58.encode(secret)}</code>
      </p>
      <ion-button
        role="button"
        tabindex="0"
        on:keypress
        on:click={() => {
          if (identity.value) {
            identity.push();
            session().importIdentity(identity.value.address.value, secret, () => {
              idParam.set(identity.value?.address.value);
              goto(`manage${$page.url.hash}`);
            });
          }
        }}>Continue</ion-button
      >
    {/if}
  {/await}
</ion-content>
