<script>
  import { App } from '@capacitor/app';
  import { Capacitor } from '@capacitor/core';
  import { onDestroy, onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { Drawer } from '$lib/client/components/drawer';
  import { UrlState } from '$lib/client/components/url-state';

  onMount(() => {
    if (browser && Capacitor.getPlatform() === 'android') {
      App.addListener('backButton', (event) => {
        if (event.canGoBack) window.history.back();
        else App.exitApp();
      });
    }
  });

  onDestroy(() => browser && App.removeAllListeners());
</script>

<svelte:head>
  <title>LUNA</title>
</svelte:head>

<Drawer>
  <UrlState>
    <slot />
  </UrlState>
</Drawer>

<style>
  @import './style.css';
</style>
