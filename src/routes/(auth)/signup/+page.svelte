<script lang="ts">
  import { HttpError, User } from '@enclavetech/lib-web';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getServices } from '$lib/client/utils/services';

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

    try {
      // Generate a key pair
      const { privateKey, publicKey } = await keysService.generateKeyPair(passphrase).catch(() => {
        throw 'Could not create key pair.';
      });

      // Create the user
      const createUserResult = await User.create({
        email,
        passphrase,
        username,
        privateKey,
        publicKey,
      }).catch((e) => {
        if (e instanceof HttpError) {
          errors[''] = [e.friendlyMessage];
        }
        throw e;
      });

      // Display error messages on fail
      if (createUserResult.errors) {
        errors = createUserResult.errors;
        disabled = false;
      }

      // Unlock and redirect on success
      else if (createUserResult.user) {
        try {
          await keysService.importKeyPairs(passphrase, ...createUserResult.user.keyPairs);
        } catch (error) {
          errors[''] = ['Could not import keys.'];
          throw error;
        }
        goto('/dashboard');
      }
    } catch (e) {
      // Reset form on error & display error message
      disabled = false;
      if (typeof e === 'string') {
        errors[''] = [typeof e === 'string' ? e : 'Something went wrong.'];
      }
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
