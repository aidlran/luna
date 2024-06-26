<script lang="ts">
  /* eslint-disable no-undef -- HTMLIonInputElement is a custom component */

  import { BIP39_WORDLIST_ENGLISH, importKeyring } from '@librebase/keyrings';
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { ionFocus } from '$lib/client/actions/focus';
  import Header from '$lib/client/components/header/Header.svelte';
  import { fragmentParam } from '$lib/client/components/url-state';

  const INPUTS = Array.from<HTMLIonInputElement>({ length: 12 });

  const thenParam = fragmentParam('then');

  let filteredWordlist: string[];

  let passphraseInput: HTMLIonInputElement;
  let passphraseError: string | undefined;

  let confirmInput: HTMLIonInputElement;
  let confirmError: string | undefined;

  let displayNameInput: HTMLIonInputElement;

  let disabled = false;
  let step = 1;

  function filterWordlist(this: HTMLInputElement) {
    if (this.value) {
      filteredWordlist = BIP39_WORDLIST_ENGLISH.filter((word) => word.startsWith(this.value));
    } else {
      filteredWordlist = [];
    }
  }

  onMount(() => {
    for (const ionInput of INPUTS) {
      ionInput.getInputElement().then((input) => {
        input.setAttribute('list', 'wordlist');
        input.addEventListener('input', filterWordlist);
        input.addEventListener('focus', filterWordlist);
        input.addEventListener('blur', () => (filteredWordlist = []));
      });
    }
    setTimeout(() => INPUTS[0].setFocus(), 0);
  });

  const onSubmit = () => {
    switch (step) {
      case 1: {
        disabled = true;

        let passed = true;

        for (const INPUT of INPUTS) {
          if (BIP39_WORDLIST_ENGLISH.includes(INPUT.value as string)) {
            INPUT.classList.remove('ion-invalid');
          } else {
            passed = false;
            INPUT.classList.add('ion-touched', 'ion-invalid');
          }
        }

        // TODO: check mnemonic validity before continuing

        if (passed) step++;

        disabled = false;

        break;
      }

      case 2: {
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

        let mnemonic = '';

        for (const input of INPUTS) {
          mnemonic = `${mnemonic} ${input.value}`;
        }

        importKeyring({
          mnemonic: mnemonic.trimStart(),
          passphrase,
          metadata: { displayName },
        })
          .then(() => {
            if ($thenParam) goto($thenParam);
          })
          .catch((error) => {
            disabled = false;
            throw error;
          });

        // TODO: then redirect somewhere

        break;
      }
    }
  };
</script>

<Header activeApp="sessions" backHref="./" title="Import a session" />

<ion-content class="ion-padding">
  {#if step == 1}
    <ion-card out:slide>
      <ion-card-header>
        <ion-card-title>Import a session</ion-card-title>
        <ion-card-subtitle>
          You can import an existing session into this client using the recovery phrase shown when
          it was generated.
        </ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <form class="ion-padding" on:submit|preventDefault={onSubmit}>
          <datalist id="wordlist">
            {#if filteredWordlist}
              {#each filteredWordlist as word}
                <option value={word} />
              {/each}
            {/if}
          </datalist>

          <div class="flex">
            {#each INPUTS as input, i}
              <ion-input
                required
                disabled={disabled || step != 1}
                fill="outline"
                label={`Word ${(i + 1).toString().padStart(2, '0')}`}
                label-placement="stacked"
                error-text="Please choose a valid word from the wordlist."
                bind:this={input}
              />
            {/each}
          </div>

          <ion-button type="submit" expand="block" disabled={disabled || step != 1}>
            Import session
          </ion-button>
        </form>
      </ion-card-content>
    </ion-card>
  {/if}
  {#if step == 2}
    <ion-card in:fade>
      <ion-card-content>
        <form class="ion-padding" on:submit|preventDefault={onSubmit}>
          <!-- TODO: wrapper component, lotta boilerplate input props here -->

          <div class="flex">
            <ion-input
              required
              disabled={disabled || step != 2}
              type="password"
              clear-on-edit={false}
              fill="outline"
              label="Passphrase"
              label-placement="stacked"
              class:ion-touched={passphraseError || confirmError}
              class:ion-invalid={passphraseError || confirmError}
              error-text={passphraseError}
              helper-text="Choose a strong passphrase to protect your keys."
              use:ionFocus
              bind:this={passphraseInput}
            />

            <ion-input
              required
              disabled={disabled || step != 2}
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
            disabled={disabled || step != 2}
            fill="outline"
            label="Display name"
            label-placement="stacked"
            helper-text="Enter a name to help identify the session."
            bind:this={displayNameInput}
          />

          <ion-button type="submit" expand="block" disabled={disabled || step != 2}>
            Create session
          </ion-button>
        </form>
      </ion-card-content>
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
