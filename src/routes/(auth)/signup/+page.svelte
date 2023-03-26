<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  import { generateKey } from 'openpgp';
  import { generateUsernameFromEmail } from '$lib/shared/services/username.service';

  export let form;
  export let data;

  let errors: Record<string, string[]> | undefined;

  let email: string;
  let passphrase: string;
  let usernameInput: string;
  let usernameGenerated: string;

  let initialFocus: HTMLInputElement;
  let submitButton: HTMLInputElement;

  let willClearUsername = false;

  function onEmailChange() {
    usernameGenerated = generateUsernameFromEmail(email);
  }

  function onFormSubmit() {
    // Use a generated username as the input's value
    if (!usernameInput?.length) {
      willClearUsername = true;
      usernameInput = usernameGenerated;
    }
  }

  function afterFormSubmit() {
    // If used generated username, clear input value
    if (willClearUsername) {
      usernameInput = '';
      willClearUsername = false;
    }
  }

  async function tryCreateKey() {
    if (form?.user) {
      const keyPair = await generateKey({
        format: 'armored',
        passphrase,
        userIDs: {
          email: form.user.email,
          name: form.user.name || form.user.username,
        },
      });

      const formData = new FormData();
      formData.append('privateKey', keyPair.privateKey);
      formData.append('publicKey', keyPair.publicKey);

      const response = await fetch('/api/me/key', {
        body: formData,
        method: 'POST',
      });

      if (response.ok) {
        window.location.assign('/dashboard');
      }
    }
  }

  onMount(() => {
    initialFocus.focus();
  });

  afterUpdate(() => {
    submitButton.disabled = false;
    errors = form?.errors;
    tryCreateKey();
  });
</script>

{#if data.signUpCodeValid}
  <form
    method="POST"
    action="?/createUser"
    on:submit|preventDefault={onFormSubmit}
    use:enhance={afterFormSubmit}
  >
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
    {#if errors?.email}
      <p class="error">{errors.email.join(' ')}</p>
    {/if}

    <label>
      Passphrase *
      <input type="password" name="passphrase" required minLength="10" bind:value={passphrase} />
    </label>
    {#if errors?.passphrase}
      <p class="error">{errors.passphrase.join(' ')}</p>
    {/if}

    <label>
      Username
      <input name="username" placeholder={usernameGenerated} maxLength="32" bind:value={usernameInput} />
    </label>
    {#if errors?.username}
      <p class="error">{errors.username.join(' ')}</p>
    {/if}

    <input type="submit" value="Sign Up" disabled bind:this={submitButton} />
  </form>
{:else}
  <form method="POST" action="?/submitCode" use:enhance>
    <label>
      Sign Up Code *
      <input name="signUpCode" required maxLength="48" bind:this={initialFocus} />
    </label>
    {#if errors?.signUpCode}
      <p class="error">{errors.signUpCode.join(' ')}</p>
    {/if}
    {#if $page.url.searchParams.has('invalid_code')}
      <p class="error">Invalid sign up code.</p>
    {/if}

    <input type="submit" value="Submit" disabled bind:this={submitButton} />
  </form>
{/if}

{#if errors?.['']}
  <p class="error">{errors[''].join(' ')}</p>
{/if}

<p>
  Already have an account?
  <br />
  <a href="login">Log in</a> here.
</p>
