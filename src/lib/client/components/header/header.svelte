<script lang="ts">
  import { chevronBack } from 'ionicons/icons';
  import AppSelect from './app-select/AppSelect.svelte';
  import { APPS, type AppName } from './apps';

  /** A relative path. If set, the back button appears and will navigate here on click. */
  export let backHref: string | undefined = undefined;

  /** The currently active app. */
  export let activeApp: AppName;
</script>

<ion-header>
  <ion-toolbar>
    <div slot="start" class="ion-margin-start">
      <AppSelect apps={APPS} activeAppID={activeApp} />
    </div>

    <ion-buttons slot="start">
      {#if backHref}
        <ion-button href={backHref}>
          <ion-icon icon={chevronBack} />
          <span>Back</span>
        </ion-button>
      {/if}
    </ion-buttons>

    <slot />
  </ion-toolbar>
</ion-header>
