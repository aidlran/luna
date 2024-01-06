<script lang="ts" generics="T extends App">
  import { Capacitor } from '@capacitor/core';
  import { dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used in generic
  import type { App } from './app';

  /** Apps to display. */
  // eslint-disable-next-line no-undef -- generic is defined
  export let apps: T[];

  /** The currently active app. */
  // eslint-disable-next-line no-undef -- generic is defined
  export let activeAppID: T['id'];

  const activeApp = apps.find(({ id }) => id === activeAppID);

  const filteredApps = apps.filter((app) => (dev || !app.devOnly) && activeAppID !== app.id);
</script>

<div class="horizontal">
  {#if activeApp}
    <a href={`${activeApp.path}${$page.url.hash}`}>
      <ion-title class="ion-no-padding">{activeApp.name}</ion-title>
    </a>
  {/if}

  {#if filteredApps.length}
    <ion-buttons>
      <ion-select
        interface={Capacitor.isNativePlatform() ? undefined : 'popover'}
        on:ionChange={({ detail: { value: app } }) => {
          goto(app.path);
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
  a {
    color: var(--ion-text-color);
    text-decoration: none;
  }

  .horizontal {
    display: flex;
    align-items: center;
  }
</style>
