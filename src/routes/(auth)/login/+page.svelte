<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  export let form;

  let errors: Record<string, String[]> | undefined = form?.errors;

  let identifier: string;
  let passphrase: string;

  let initialFocus: HTMLInputElement;
  onMount(() => initialFocus.focus());

  afterUpdate(() => {
    errors = form?.errors;
  });
</script>

<form method="POST" use:enhance>
  <label>
    <span>Username or email</span>
    <input name="identifier" required bind:value={identifier} bind:this={initialFocus} />
  </label>

  <label>
    <span>Passphrase</span>
    <input type="password" name="passphrase" required bind:value={passphrase} />
  </label>

  <input type="submit" value="Log In" />
</form>

{#if $page.url.searchParams.has('no_keys')}
  <p class="error">Please re-authenticate to finish onboarding.</p>
{/if}

{#if errors}
  {#each Object.values(errors) as errorList}
    <p class="error">{errorList.join(' ')}</p>
  {/each}
{/if}

<p>
  Don't have an account?
  <br />
  <a href="signup">Sign up</a> here.
</p>
