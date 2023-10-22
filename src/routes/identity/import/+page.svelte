<script lang="ts">
  import { base58 } from 'trusync';
  import { getApp } from 'trusync-svelte';
  import { focus } from '$lib/client/actions/focus';

  const app = getApp();

  let address: string;
  let secret: string;

  function submit() {
    const decoded = base58.decode(secret);
    app.identity.import(address, decoded);
  }
</script>

<a href="manage">Back</a>

<h1>Import an identity</h1>

<p>You can also <a href="create/identity">create an identity</a> instead.</p>

<form on:submit|preventDefault={submit}>
  <label>
    Address (required)
    <input required bind:value={address} use:focus />
  </label>
  <label>
    Secret key (required)
    <input required bind:value={secret} />
  </label>
  <input type="submit" value="Import identity" />
</form>
