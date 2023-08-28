<script lang="ts">
  // import { onMount } from 'svelte';
  import { app as getApp } from 'trusync-svelte';

  // let passphrase: string;

  let disabled = false;
  // let initialFocus: HTMLElement;

  const app = getApp();

  // onMount(() => initialFocus.focus());

  async function onSubmit() {
    disabled = true;
    const result = await app.createIdentity();

    // TODO: present private key recovery phrase

    // TODO: passphrase used to create a local encrypted session
    //       to store the keys (probably the concern of truSync KMS)

    debugger;
    disabled = false;
  }
</script>

<form on:submit|preventDefault={onSubmit}>
  <!-- <label>
    Passphrase *
    <input
      type="password"
      name="passphrase"
      required
      minLength="10"
      bind:value={passphrase}
      bind:this={initialFocus}
    />
  </label> -->

  <input type="submit" value="Get Started" {disabled} />
</form>
