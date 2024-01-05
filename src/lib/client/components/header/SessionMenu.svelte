<script lang="ts">
  /* eslint-disable no-undef -- HTMLIonSelectElement is a custom component */

  import { Capacitor } from '@capacitor/core';
  import type { SelectChangeEventDetail } from '@ionic/core';
  import 'ionic-svelte/components/ion-alert';
  import { session } from 'trusync';
  import { activeSession } from 'trusync-svelte';
  import { APPS } from './apps';

  const activeSessionStore = activeSession();

  let selectElement: HTMLIonSelectElement;
  let displayConfirmResetModal = false;

  function onChange(event: CustomEvent<SelectChangeEventDetail<'end'>>): void {
    if (event.detail.value === 'end' && $activeSessionStore) {
      displayConfirmResetModal = true;
    }
  }

  function cancel(): void {
    displayConfirmResetModal = false;
    selectElement.value = undefined;
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
  <ion-button href={APPS.find(({ id }) => id === 'sessions').path}>Sign in</ion-button>
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
        session().clear();
        displayConfirmResetModal = false;
      },
    },
  ]}
  on:ionAlertDidDismiss={cancel}
/>
