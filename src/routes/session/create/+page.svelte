<script lang="ts">
  import { session } from 'trusync';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { focus } from '$lib/client/actions/focus';
  import Header from '$lib/client/components/header/header.svelte';

  let errors = new Array<string>();

  let password: string;
  let passwordError = false;

  let confirm: string;
  let confirmError = false;

  let displayName: string | undefined;
  let displayNameError = false;

  let working = false;

  async function onSubmit(): Promise<void> {
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
      session().initSession(password, metadata, (result) => {
        if (result instanceof Error) {
          errors.push(result.message);
        } else if (typeof result === 'string') {
          errors.push(result);
        } else {
          goto(`.${$page.url.hash}`);
        }
      });
    }
    errors = errors;
    working = false;
  }
</script>

<Header activeApp="session" backHref={`.${$page.url.hash}`}>
  <ion-title>Create a session</ion-title>
</Header>

<ion-content class="ion-padding">
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

  <!-- TODO: common errors or form component -->
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
      Password (required)
      <input required type="password" bind:value={password} />
    </label>
    <label class:error={confirmError}>
      Confirm your password (required)
      <input required type="password" bind:value={confirm} />
    </label>
    <label class:error={displayNameError}>
      Display name (optional)
      <input bind:value={displayName} />
    </label>
    <input type="submit" value="Create Session" disabled={working} />
  </form>
</ion-content>
