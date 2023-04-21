<script lang="ts">
  import { generateKey } from 'openpgp';

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import { FetchError, createUser, getServices } from '$lib/client';
  const { keysService, usernameService } = getServices();

  let errors: Record<string, string[]> = {};

  let email: string;
  let passphrase: string;
  let usernameInput: string;
  let usernameGenerated: string;

  let disabled = false;
  let initialFocus: HTMLInputElement;

  onMount(() => initialFocus.focus());

  function onEmailChange() {
    usernameGenerated = usernameService.generateFromEmail(email);
  }

  async function onSubmit() {
    disabled = true;
    const username = usernameInput || usernameGenerated;
    let keyPair;
    let createUserResult;

    // Whole thing is wrapped in a try/catch to un-disable form on error
    // try/catch blocks within are for displaying a relevant error message
    try {
      // Generate a key pair
      try {
        keyPair = await generateKey({
          format: 'armored',
          passphrase,
          userIDs: {
            email,
            name: username,
          },
        });
      } catch (error) {
        errors[''] = ["Could not create key pair. Please ensure you've entered a valid email address."];
        throw error;
      }

      // Extract armored keys from keyPair
      const { privateKey, publicKey } = keyPair;

      // Create the user
      try {
        createUserResult = await createUser({
          email,
          passphrase,
          username,
          privateKey,
          publicKey,
        });
      } catch (error) {
        if (error instanceof FetchError) {
          errors[''] = [error.friendlyMessage];
        }
        throw error;
      }

      // Display error messages on fail
      if (createUserResult.errors) {
        errors = createUserResult.errors;
        disabled = false;
      }

      // Unlock and redirect on success
      else if (createUserResult.user) {
        try {
          await keysService.import(passphrase, ...createUserResult.user.keyPairs);
        } catch (error) {
          errors[''] = ['Could not import keys.'];
          throw error;
        }
        goto('/dashboard');
      }
    } catch (error) {
      // Reset form on error
      console.error(error);
      disabled = false;
    }
  }
</script>

<form method="POST" on:submit|preventDefault={onSubmit}>
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

  <input type="submit" value="Sign Up" {disabled} />
</form>

{#if errors?.['']}
  <p class="error">{errors?.[''].join(' ')}</p>
{/if}
