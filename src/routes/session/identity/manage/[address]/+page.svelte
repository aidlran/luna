<script lang="ts">
  import { forgetIdentity } from 'trusync';
  import { activeSessionStore } from 'trusync-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  $: if (!$activeSessionStore?.identities.has($page.params.address)) {
    goto('../../');
  }

  // TODO: "Are you sure?" modal on forget
</script>

<a href={`../../${$page.url.hash}`}>Back</a>

<h1>Manage Identity</h1>

<div class="border">
  <h2>Address</h2>
  <p>
    This is the identity's public address. It is derived from the public keys associated with the
    identity.
  </p>
  <code>{$page.params.address}</code>
</div>

<div class="border danger" style="display: flex">
  <div style="flex-grow: 1">
    <h2>Forget identity</h2>
    <p>
      <strong>Warning</strong>
      Forgetting this identity will remove its keys from this client, which means it will no longer be
      able to assume this identity unless you import it again. Ensure you have a recovery method ready
      or you will be locked out forever. No data will be directly deleted by this action.
    </p>
  </div>
  <div>
    <button class="danger" on:click={() => forgetIdentity($page.params.address)}
      >Forget identity</button
    >
  </div>
</div>

<style>
  .border {
    border: 1px solid #000;
    border-radius: 8px;
    margin: 24px 0;
    padding: 24px;
  }

  .border.danger {
    display: flex;
    align-items: center;
  }

  button {
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
  }

  .danger {
    border: 1px solid #f00;
  }
</style>
