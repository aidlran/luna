<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  export let form;

  let error =
    form?.error ?? ($page.url.searchParams.has('invalid') ? 'Invalid sign up code.' : undefined);

  let initialFocus: HTMLInputElement;

  onMount(() => {
    initialFocus.focus();
  });

  afterUpdate(() => {
    error = form?.error;
  });
</script>

<form method="POST" use:enhance>
  <label>
    Sign Up Code *
    <input name="signUpCode" required maxLength="48" bind:this={initialFocus} />
  </label>
  <input type="submit" value="Submit" />
</form>

{#if error}
  <p class="error">{error}</p>
{/if}
