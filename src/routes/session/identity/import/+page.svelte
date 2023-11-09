<script lang="ts">
  import { base58, importIdentity } from 'trusync';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { focus } from '$lib/client/actions/focus';
  import { fragmentParam } from '$lib/client/components/url-state';

  const idParam = fragmentParam('id');

  let errors = new Array<string>();

  let address: string;
  let addressError = false;

  let secretKey: string;
  let secretKeyError = false;

  let working = false;

  async function onSubmit(): Promise<void> {
    working = true;
    while (errors.length) {
      errors.pop();
    }
    addressError = secretKeyError = false;
    if (!address.trim().length) {
      errors.push('Please enter an address.');
      addressError = true;
    }
    let rawSecret!: Uint8Array;
    if (!secretKey.trim().length) {
      errors.push('Please enter the secret key.');
      secretKeyError = true;
    } else {
      try {
        rawSecret = base58.decode(secretKey);
      } catch (error) {
        errors.push('The secret key is not formatted correctly.');
        secretKeyError = true;
      }
    }
    if (!errors.length) {
      importIdentity(address, rawSecret, (error) => {
        if (error) {
          errors.push(error.message);
        }
        else {
          idParam.set(address);
          goto(`manage${$page.url.hash}`);
        }
      });
    }
    errors = errors;
    working = false;
  }
</script>

<a href={`../${$page.url.hash}`}>Back</a>

<h1>Import an identity</h1>

<!-- TODO: common errors or form component -->
{#if errors.length}
  <div>
    <h1>There {errors.length > 1 ? 'were problems' : 'was a problem'} importing the identity.</h1>
    <ul>
      {#each errors as error}
        <li>{error}</li>
      {/each}
    </ul>
  </div>
{/if}

<form on:submit|preventDefault={onSubmit}>
  <label class:error={addressError} use:focus>
    Address (required)
    <input required bind:value={address} />
  </label>
  <label class:error={secretKeyError}>
    Secret key (required)
    <input required bind:value={secretKey} />
  </label>
  <input type="submit" value="Import identity" disabled={working} />
</form>
