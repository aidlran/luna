<script lang="ts">
  import { App } from '@capacitor/app';
  import { Capacitor } from '@capacitor/core';
  import 'ionic-svelte/components/ion-app';
  import { indexedDBDriver, registerDriver } from 'librebase';
  import { browser } from '$app/environment';
  import { Drawer } from '$lib/client/components/drawer';
  import { UrlState } from '$lib/client/components/url-state';
  import { keyCode } from '$lib/client/functions/key-code';
  import { debugMode } from '$lib/client/stores/debug-mode';

  let ionReady = false;

  if (browser) {
    indexedDBDriver().then(registerDriver);
    import('ionic-svelte').then((m) => m.setupIonicBase() && (ionReady = true));
    if (Capacitor.getPlatform() === 'android') {
      App.addListener('backButton', (event) => {
        if (event.canGoBack) window.history.back();
        else App.exitApp();
      });
    }
    const meta = document.head.getElementsByTagName('meta').namedItem('viewport');
    if (meta && Capacitor.isNativePlatform()) {
      meta.content += ', minimum-scale=1, maximum-scale=1, user-scalable=no';
    }
    keyCode({
      code: ['w', 'w', 's', 's', 'a', 'd', 'a', 'd', 'b', 'a'],
      activates: () => {
        debugMode.set(true);
        // eslint-disable-next-line no-console
        console.log('%cDebug mode enabled', 'color: orange; font-size: 1.5em');
      },
      once: true,
    });
  }
</script>

<svelte:head>
  <title>LUNA</title>
  <meta name="description" content="LUNA: productivity assistant." />
</svelte:head>

{#if ionReady}
  <Drawer>
    <UrlState>
      <ion-app>
        <slot />
      </ion-app>
    </UrlState>
  </Drawer>
{/if}

<style>
  @import './palette.css';
  @import './style.css';
</style>
