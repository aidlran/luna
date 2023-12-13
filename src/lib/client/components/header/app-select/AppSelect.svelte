<script lang="ts">
  import { Capacitor } from '@capacitor/core';
  import 'ionic-svelte/components/ion-select';
  import 'ionic-svelte/components/ion-select-option';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { APPS } from './apps';
  import type { AppName } from './app-name';

  /** The currently active app. */
  export let activeApp: AppName;
</script>

<div class="horizontal">
  <!-- Likely unreactive to fragment param state changes between page navigations -->
  <!-- Unlikely to be issue unless fragment param is tracking global state -->
  <a href={`/${activeApp}/${$page.url.hash}`}>
    <ion-title class="ion-no-padding">{APPS[activeApp]}</ion-title>
  </a>

  <ion-buttons>
    <ion-select
      interface={Capacitor.isNativePlatform() ? undefined : 'popover'}
      on:ionChange={({ detail: { value: appName } }) => {
        goto(`/${appName}/${$page.url.hash}`);
      }}
    >
      {#each Object.entries(APPS) as [value, text]}
        {#if activeApp !== value}
          <ion-select-option {value}>{text}</ion-select-option>
        {/if}
      {/each}
    </ion-select>
  </ion-buttons>
</div>

<style>
  .horizontal {
    display: flex;
    align-items: center;
  }
</style>
