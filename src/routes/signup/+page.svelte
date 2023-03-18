<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { enhance } from '$app/forms';

  import { generateUsernameFromEmail } from '$lib/shared/services/username.service';
  import { AuthForm } from '$lib/client/components';

  export let form;
  export let data;

  let email: string;
  let usernameInput: string;
  let usernameGenerated: string;

  let initialFocus: HTMLInputElement;

  let willClearUsername = false;

  onMount(() => initialFocus.focus());

  function onEmailChange() {
    usernameGenerated = generateUsernameFromEmail(email);
  }

  /**
   * If the user hasn't input a username, we need to copy the
   * auto-generated one into the input value before submit.
   */
  function onFormSubmit() {
    if (!usernameInput?.length) {
      willClearUsername = true;
      usernameInput = usernameGenerated;
    }
  }

  // After a failed form submit with the auto-generated username, we need to
  // clear the input value so that the placeholder bind is visible again.
  afterUpdate(() => {
    if (willClearUsername) {
      usernameInput = '';
      willClearUsername = false;
    }
  });
</script>

<AuthForm errors={form?.errors}>
  <form
    slot="form"
    method="POST"
    action={data.signUpCodeValid ? '?/signUp' : '?/submitCode'}
    on:submit|preventDefault={data.signUpCodeValid ? onFormSubmit : null}
    use:enhance
  >
    {#if data.signUpCodeValid}
      <label>
        Email *
        <input
          type="email"
          name="email"
          required
          maxLength="255"
          bind:value={email}
          bind:this={initialFocus}
          on:input={onEmailChange}
        />
      </label>
      <label>
        Passphrase *
        <input type="password" name="passphrase" required minLength="10" />
      </label>
      <label>
        Username
        <input name="username" placeholder={usernameGenerated} maxLength="32" bind:value={usernameInput} />
      </label>
      <input type="submit" value="Sign Up" />
    {:else}
      <label>
        Sign Up Code *
        <input name="signUpCode" required maxLength="48" bind:this={initialFocus} />
      </label>
      <input type="submit" value="Submit" />
    {/if}
  </form>

  <p slot="footer">
    Already have an account?
    <br />
    <a href="login">Log in</a> here.
  </p>
</AuthForm>
