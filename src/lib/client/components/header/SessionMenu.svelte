<script lang="ts">
  /* eslint-disable no-undef -- HTMLIonSelectElement is a custom component */

  import { Capacitor } from '@capacitor/core';
  import type { SelectChangeEventDetail } from '@ionic/core';
  import 'ionic-svelte/components/ion-alert';
  import { deactivateKeyring } from 'librebase';
  import { activeKeyring } from 'librebase-svelte';
  import { page } from '$app/stores';
  import { fragmentParam } from '../url-state';
  import { APPS } from './apps';

  const activeSessionStore = activeKeyring();
  const thenParam = fragmentParam('then');

  let selectElement: HTMLIonSelectElement | undefined;
  let displayConfirmResetModal = false;

  const loginHrefBase = APPS.find(({ id }) => id === 'sessions').path;
  let loginHref: string;
  $: {
    loginHref = loginHrefBase;
    if (!$page.url.hash) {
      loginHref += `#then=${$page.url.pathname}`;
    } else {
      loginHref += $page.url.hash;
      if (!$thenParam) {
        loginHref += `&then=${$page.url.pathname}`;
      }
    }
  }

  function onChange(event: CustomEvent<SelectChangeEventDetail<'end'>>): void {
    if (event.detail.value === 'end' && $activeSessionStore) {
      displayConfirmResetModal = true;
    }
  }

  function cancel(): void {
    displayConfirmResetModal = false;
    if (selectElement) selectElement.value = undefined;
  }
</script>

{#if $activeSessionStore}
  <ion-select
    interface={Capacitor.isNativePlatform() ? undefined : 'popover'}
    aria-label="Active Session"
    on:ionChange={onChange}
    bind:this={selectElement}
  >
    <ion-select-option value="end">End session</ion-select-option>
  </ion-select>
{:else}
  <ion-button href={loginHref}>Sign in</ion-button>
{/if}

<!-- TODO: common modal component or system -->
<!-- {#if displayConfirmResetModal} -->

<ion-alert
  is-open={displayConfirmResetModal}
  header="End session"
  message="Are you sure you want to end the active session?"
  buttons={[
    { text: 'Cancel', role: 'cancel' },
    {
      text: 'Confirm',
      role: 'destructive',
      handler: () => {
        deactivateKeyring();
        displayConfirmResetModal = false;
      },
    },
  ]}
  on:ionAlertDidDismiss={cancel}
/>
