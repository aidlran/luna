<script lang="ts">
  import { App } from '@capacitor/app';
  import { Capacitor } from '@capacitor/core';
  import 'ionic-svelte/components/ion-app';
  import { browser } from '$app/environment';
  import { Drawer } from '$lib/client/components/drawer';
  import { UrlState } from '$lib/client/components/url-state';

  let ionReady = false;

  if (browser) {
    import('ionic-svelte').then(({ setupIonicBase }) => setupIonicBase() && (ionReady = true));
    if (Capacitor.getPlatform() === 'android') {
      App.addListener('backButton', (event) => {
        if (event.canGoBack) window.history.back();
        else App.exitApp();
      });
    }
  }
</script>

<svelte:head>
  <title>LUNA</title>
</svelte:head>

{#if ionReady}
  <ion-app>
    <Drawer>
      <UrlState>
        <slot />
      </UrlState>
    </Drawer>
  </ion-app>
{/if}

<style>
  @import './style.css';
  @import './variables.css';
</style>
