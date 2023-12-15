<script lang="ts" generics="T extends App">
  import { Capacitor } from '@capacitor/core';
  import 'ionic-svelte/components/ion-select';
  import 'ionic-svelte/components/ion-select-option';
  import { dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { App } from './app';

  /** Apps to display. */
  // eslint-disable-next-line no-undef
  export let apps: T[];

  /** The currently active app. */
  // eslint-disable-next-line no-undef
  export let activeAppID: T['id'];

  const activeApp = apps.find(({ id }) => id === activeAppID);

  const filteredApps = apps.filter((app) => (dev || !app.devOnly) && activeAppID !== app.id);
</script>

<div class="horizontal">
  {#if activeApp}
    <!-- Likely unreactive to fragment param state changes between page navigations -->
    <!-- Unlikely to be issue unless fragment param is tracking global state -->
    <a href={`${activeApp.path}${$page.url.hash}`}>
      <ion-title class="ion-no-padding">{activeApp.name}</ion-title>
    </a>
  {/if}

  {#if filteredApps.length}
    <ion-buttons>
      <ion-select
        interface={Capacitor.isNativePlatform() ? undefined : 'popover'}
        on:ionChange={({ detail: { value: app } }) => {
          goto(`${app.path}${$page.url.hash}`);
        }}
      >
        {#each filteredApps as app}
          {#if !app.devOnly || (dev && activeAppID !== app.id)}
            <ion-select-option value={app}>{app.name}</ion-select-option>
          {/if}
        {/each}
      </ion-select>
    </ion-buttons>
  {/if}
</div>

<style>
  .horizontal {
    display: flex;
    align-items: center;
  }
</style>
