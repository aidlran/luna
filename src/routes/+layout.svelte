<script lang="ts">
  import { App } from '@capacitor/app';
  import { Capacitor } from '@capacitor/core';
  import { LocalStorageChannel, channel } from 'trusync/channel';
  import { browser } from '$app/environment';
  import { Drawer } from '$lib/client/components/drawer';
  import { UrlState } from '$lib/client/components/url-state';

  channel().push(new LocalStorageChannel());

  let ionReady = false;

  if (browser) {
    import('ionic-svelte').then(({ setupIonicBase }) => setupIonicBase() && (ionReady = true));
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
  }
</script>

<svelte:head>
  <title>LUNA</title>
  <meta name="description" content="LUNA: productivity assistant." />
</svelte:head>

{#if ionReady}
  <Drawer>
    <UrlState>
      <slot />
    </UrlState>
  </Drawer>
{/if}

<style>
  @import './style.css';
  @import './variables.css';
</style>
