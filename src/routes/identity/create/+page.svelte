<script lang="ts">
  import { getApp } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { base58 } from 'trusync';
  const app = getApp();
</script>

<h1>Create an identity</h1>

{#await app.identity.create() then identity}
  <p>
    <span>Your address:</span>
    <code>{identity.address.value}</code>
  </p>
  <p>
    <span>Your recovery code:</span>
    <code>{base58.encode(identity.secret)}</code>
  </p>
  <button
    on:click={async () => {
      // await app.identity.import(identity.address.value, base58.encode(identity.secret));
      await goto(`manage/${identity.address.value}`);
    }}>Continue</button
  >
{/await}

<p>You can also <a href="import">import an identity</a> instead.</p>
