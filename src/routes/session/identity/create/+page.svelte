<script lang="ts">
  import { base58, generateIdentity, importIdentity } from 'trusync';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
</script>

<a href={`../${$page.url.hash}`}>Back</a>

<h1>Create an identity</h1>

{#await generateIdentity() then identity}
  <p>
    <span>Your address:</span>
    <code>{identity.address.value}</code>
  </p>
  <p>
    <span>Your recovery code:</span>
    <code>{base58.encode(identity.secret)}</code>
  </p>
  <button
    on:click={() =>
      importIdentity(identity.address.value, identity.secret, () =>
        goto(`manage/${identity.address.value}`),
      )}>Continue</button
  >
{/await}
