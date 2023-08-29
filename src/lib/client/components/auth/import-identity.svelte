<script lang="ts">
  // import { Session } from 'trusync';
  import { onMount } from 'svelte';
  // import { goto } from '$app/navigation';

  let displayedError: string | undefined;

  let identity: string;
  let privateKey: string;

  let disabled = false;
  let initialFocus: HTMLInputElement;

  onMount(() => initialFocus.focus());

  async function onSubmit() {
    // disabled = true;
    // // Whole thing is wrapped in a try/catch to un-disable form on error
    // // try/catch blocks within are for displaying a relevant error message
    // try {
    //   // Try to log in
    //   const loginResult = await Session.signInWithCredentials(identity, privateKey).catch(
    //     (error) => {
    //       if (error instanceof Error) {
    //         displayedError = error.message;
    //       }
    //       throw error;
    //     },
    //   );
    //   // Display error message on fail
    //   if (loginResult.message) {
    //     displayedError = loginResult.message;
    //     disabled = false;
    //   }
    //   // Unlock and redirect on success
    //   else if (loginResult.user) {
    //     goto('/dashboard');
    //   }
    // } catch (error) {
    //   // Reset form on error
    //   disabled = false;
    //   throw error;
    // }
  }
</script>

<form method="POST" on:submit|preventDefault={onSubmit}>
  <label>
    <span>Identity</span>
    <input bind:value={identity} required bind:this={initialFocus} />
  </label>

  <label>
    <span>Private Key</span>
    <input bind:value={privateKey} required type="password" />
  </label>

  <input type="submit" value="Import identity" {disabled} />
</form>

{#if displayedError}
  <p class="error">{displayedError}</p>
{/if}

<style>
  label {
    margin-bottom: 16px;
  }

  input[type='submit'] {
    margin-top: 16px;
  }
</style>
