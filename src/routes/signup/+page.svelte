<script lang="ts">
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';

  import { AuthForm } from '$lib/components';
  import { generateUsernameFromEmail } from '$lib/services/username.service';

  export let form;

  let email: string;
  let passphrase: string;
  let usernameInput: string;
  let usernameGenerated: string;

  let initialFocus: HTMLInputElement;

  onMount(() => initialFocus.focus());

  function onEmailChange(event: Event) {
    usernameGenerated = generateUsernameFromEmail(email);
  }

  function onFormSubmit(event: Event) {
    if (!usernameInput?.length) {
      usernameInput = usernameGenerated;
    }
  }
</script>

<AuthForm errors={form?.errors}>
  <form slot="form" method="POST" on:submit|preventDefault={onFormSubmit} use:enhance>
    <label>
      Email *
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        maxLength="255"
        bind:value={email}
        bind:this={initialFocus}
        on:input={onEmailChange}
      />
    </label>
    <label>
      Passphrase *
      <input
        type="password"
        name="passphrase"
        placeholder="Passphrase"
        required
        minLength="10"
        bind:value={passphrase}
      />
    </label>
    <label>
      Username
      <input
        name="username"
        placeholder={usernameGenerated || 'Username'}
        maxLength="32"
        bind:value={usernameInput}
      />
    </label>
    <input type="submit" value="Sign Up" />
  </form>

  <p slot="footer">
    Already have an account?
    <br />
    <a href="login">Log in</a> here.
  </p>
</AuthForm>
