<script lang="ts">
  import { Capacitor } from '@capacitor/core';
  import { chevronBack } from 'ionicons/icons';
  import AppSelect from './app-select/AppSelect.svelte';
  import { APPS, type AppID } from './apps';

  /** The currently active app. */
  export let activeApp: AppID;

  /** A relative path. If set, the back button appears and will navigate here on click. */
  export let backHref: string | undefined = undefined;

  export let title: string | undefined = undefined;
</script>

<ion-header>
  <ion-toolbar>
    <div slot="start" class="ion-margin-start">
      <AppSelect apps={APPS} activeAppID={activeApp} />
    </div>

    {#if Capacitor.isNativePlatform()}
      <ion-buttons slot="start">
        {#if backHref}
          <ion-button href={backHref}>
            <ion-icon icon={chevronBack} />
            <span>Back</span>
          </ion-button>
        {/if}
      </ion-buttons>

      {#if title}
        <ion-title>{title}</ion-title>
      {/if}
    {/if}

    <slot />
  </ion-toolbar>
</ion-header>
