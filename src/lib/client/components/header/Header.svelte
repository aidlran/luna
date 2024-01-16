<script lang="ts">
  import { Capacitor } from '@capacitor/core';
  import 'ionic-svelte/components/ion-select';
  import 'ionic-svelte/components/ion-select-option';
  import { chevronBack } from 'ionicons/icons';
  import { page } from '$app/stores';
  import AppSelect from './app-select/AppSelect.svelte';
  import { APPS, type AppID } from './apps';
  import SessionSwitcher from './SessionMenu.svelte';

  /** The currently active app. */
  export let activeApp: AppID;

  /** A relative path. If set, the back button appears and will navigate here on click. */
  export let backHref: string | undefined = undefined;

  export let title: string | undefined = undefined;
</script>

<ion-header>
  <ion-toolbar>
    <div slot="start" class="ion-margin-start">
      <div style="display:inline-block">
        <AppSelect apps={APPS} activeAppID={activeApp} />
      </div>

      {#if !Capacitor.isNativePlatform()}
        <ion-buttons>
          {#if backHref}
            <ion-button href={`${backHref}${$page.url.hash}`}>
              <ion-icon icon={chevronBack} />
              <span>Back</span>
            </ion-button>
          {/if}
        </ion-buttons>
      {/if}
    </div>

    {#if !Capacitor.isNativePlatform() && title}
      <ion-title>{title}</ion-title>
    {/if}

    <slot />

    <div slot="end" class="ion-margin-end">
      <SessionSwitcher />
    </div>
  </ion-toolbar>
</ion-header>
