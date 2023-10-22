<script lang="ts">
  import { getApp } from 'trusync-svelte';
  import { focus } from '$lib/client/actions/focus';
  import { goto } from '$app/navigation';

  const app = getApp();

  let errors = new Array<string>();

  let password: string;
  let passwordError = false;

  let confirm: string;
  let confirmError = false;

  let displayName: string | undefined;
  let displayNameError = false;

  let working = false;

  async function onSubmit() {
    working = true;
    while (errors.length) {
      errors.pop();
    }
    passwordError = confirmError = displayNameError = false;
    displayName = displayName?.trim();
    if (!password.length) {
      errors.push('Please enter a password.');
      passwordError = true;
    } else if (password !== confirm) {
      errors.push('Passwords do not match.');
      confirmError = true;
    } else {
      const metadata = displayName?.length ? { displayName } : undefined;
      await app.identity.initSession(password, metadata).catch((error) => {
        errors.push(error instanceof Error ? error.message : 'Unknown error.');
      });
      await goto('identity');
    }
    errors = errors;
    working = false;
  }
</script>

<div style="margin: auto; max-width: 1080px;">
  <a href="../../">Back</a>

  <h1>Create a Session</h1>

  <p>
    Your session is how your identity secrets are stored and managed securely by your client.
    Sessions are local to the client and device. If you want to use your identities in another
    truSync client or on another device, you will need to create a local session there and import
    your identities.
  </p>

  <p>
    Sessions act similarly to a user profile that is stored locally to the device. It is password
    protected and holds the secrets of identities that you create or import. You can also give it a
    display name (like a username) to help identify it when there are multiple sessions.
  </p>

  {#if errors.length}
    <div>
      <h1>There {errors.length > 1 ? 'were problems' : 'was a problem'} creating the session.</h1>
      <ul>
        {#each errors as error}
          <li>{error}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <form on:submit|preventDefault={onSubmit}>
    <label class:error={passwordError} use:focus>
      Password
      <input required type="password" bind:value={password} />
    </label>
    <label class:error={confirmError}>
      Confirm your password
      <input required type="password" bind:value={confirm} />
    </label>
    <label class:error={displayNameError}>
      Display name (optional)
      <input bind:value={displayName} />
    </label>
    <input type="submit" value="Create Session" disabled={working} />
  </form>
</div>
