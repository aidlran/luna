<script lang="ts">
  import { Session, HttpError } from '@enclavetech/lib-web';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import { getServices } from '$lib/client/utils/services';

  const { keysService } = getServices();

  let displayedError: string | undefined;

  let identifier: string;
  let passphrase: string;

  let disabled = false;
  let initialFocus: HTMLInputElement;

  onMount(() => initialFocus.focus());

  async function onSubmit() {
    disabled = true;

    // Whole thing is wrapped in a try/catch to un-disable form on error
    // try/catch blocks within are for displaying a relevant error message
    try {
      // Try to log in
      const loginResult = await Session.signInWithCredentials(identifier, passphrase).catch((error) => {
        if (error instanceof HttpError) {
          displayedError = error.friendlyMessage;
        }
        throw error;
      });

      // Display error message on fail
      if (loginResult.message) {
        displayedError = loginResult.message;
        disabled = false;
      }

      // Unlock and redirect on success
      else if (loginResult.user) {
        try {
          await keysService.importKeyPairs(loginResult.user.keyPairs);
        } catch (error) {
          displayedError = 'Could not import keys.';
          throw error;
        }
        goto('/dashboard');
      }
    } catch (error) {
      // Reset form on error
      disabled = false;
      throw error;
    }
  }
</script>

<form method="POST" on:submit|preventDefault={onSubmit}>
  <label>
    <span>Username or email</span>
    <input bind:value={identifier} required bind:this={initialFocus} />
  </label>

  <label>
    <span>Passphrase</span>
    <input bind:value={passphrase} required type="password" />
  </label>

  <input type="submit" value="Log In" {disabled} />
</form>

{#if displayedError}
  <p class="error">{displayedError}</p>
{/if}

<p>
  Don't have an account?
  <br />
  <a href="/signup">Sign up</a> here.
</p>
