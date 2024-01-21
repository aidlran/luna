<script lang="ts">
  /* eslint-disable no-undef -- HTMLIonInputElement is a custom component */

  import 'ionic-svelte/components/ion-item.js';
  import 'ionic-svelte/components/ion-label.js';
  import 'ionic-svelte/components/ion-list.js';
  import 'ionic-svelte/components/ion-note.js';
  import { session } from 'librebase';
  import { fade, slide } from 'svelte/transition';
  import { ionFocus } from '$lib/client/actions/focus';
  import Header from '$lib/client/components/header/Header.svelte';
  import { fragmentParam } from '$lib/client/components/url-state';
  import type { SessionMetadata } from '$lib/client/types/session-metadata';

  const thenParam = fragmentParam('then');

  let passphraseInput: HTMLIonInputElement;
  let passphraseError: string | undefined;

  let confirmInput: HTMLIonInputElement;
  let confirmError: string | undefined;

  let displayNameInput: HTMLIonInputElement;

  let mnemonic: string[] | undefined;
  $: mnemonic && (disabled = true);

  let disabled = false;

  async function onSubmit(): Promise<void> {
    disabled = true;

    passphraseError = confirmError = undefined;

    const passphrase = passphraseInput.value as string;
    const confirm = confirmInput.value as string;
    const displayName = (displayNameInput.value as string).trim();

    if (!passphrase.length) {
      passphraseError = 'Please enter a passphrase';
    }

    if (confirm !== passphrase) {
      confirmError = 'Passphrases do not match';
    }

    if (passphraseError) {
      disabled = false;
      passphraseInput.setFocus();
      return;
    }

    if (confirmError) {
      disabled = false;
      confirmInput.setFocus();
      return;
    }

    session<SessionMetadata>()
      .create.asPromise({
        passphrase,
        metadata: { displayName },
      })
      .then((result) => {
        mnemonic = result.mnemonic.split(' ');

        // TODO: redirect to dedicated session edit/manage screen
        //       to display recovery phrase now and at a later date

        // TODO: verify recovery phrase, ask for each word in random order
      })
      .catch((error) => {
        disabled = false;
        throw error;
      });
  }
</script>

<Header activeApp="sessions" backHref="./" title="Create a session" />

<ion-content class="ion-padding">
  {#if !mnemonic}
    <ion-card out:slide>
      <ion-card-header>
        <ion-card-title>Create a session</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <form class="ion-padding" on:submit|preventDefault={onSubmit}>
          <!-- TODO: wrapper component, lotta boilerplate input props here -->

          <div class="flex">
            <ion-input
              required
              {disabled}
              type="password"
              clear-on-edit={false}
              fill="outline"
              label="Passphrase"
              label-placement="stacked"
              class:ion-touched={passphraseError || confirmError}
              class:ion-invalid={passphraseError || confirmError}
              error-text={passphraseError}
              helper-text="Choose a strong passphrase to protect your keys."
              use:ionFocus={13}
              bind:this={passphraseInput}
            />

            <ion-input
              required
              {disabled}
              type="password"
              clear-on-edit={false}
              fill="outline"
              label="Confirm passphrase"
              label-placement="stacked"
              class:ion-touched={confirmError}
              class:ion-invalid={confirmError}
              error-text={confirmError}
              bind:this={confirmInput}
            />
          </div>

          <ion-input
            required
            {disabled}
            fill="outline"
            label="Display name"
            label-placement="stacked"
            helper-text="Enter a name to help identify the session."
            bind:this={displayNameInput}
          />

          <ion-button type="submit" expand="block" {disabled}>Create session</ion-button>
        </form>
      </ion-card-content>
    </ion-card>
  {:else}
    <ion-card in:fade>
      <ion-card-header>
        <ion-card-title>Your recovery phrase</ion-card-title>
        <ion-card-subtitle>
          This {mnemonic.length} word recovery phrase is needed to restore access to the session if it
          is deleted, or to use the session in another client. Keep it safe.
        </ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          {#each mnemonic as word, i}
            <ion-item>
              <ion-note slot="start">{(i + 1).toString().padStart(2, '0')}</ion-note>
              <ion-label>{word}</ion-label>
            </ion-item>
          {/each}
        </ion-list>
      </ion-card-content>

      <ion-button expand="block" href={$thenParam ?? './'}>Got it</ion-button>
    </ion-card>
  {/if}
</ion-content>

<style>
  ion-input {
    margin-bottom: 24px;
  }

  ion-card {
    margin: auto;
    max-width: 700px;
    color: var(--ion-text-color);
  }

  @media only screen and (min-width: 680px) {
    .flex {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
    }

    .flex ion-input {
      max-width: calc(50% - 16px);
    }
  }
</style>
