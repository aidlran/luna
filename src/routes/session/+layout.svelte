<script lang="ts">
  import 'ionic-svelte/components/ion-menu';
  import 'ionic-svelte/components/ion-split-pane';
  import { menuController, registerMenu } from 'ionic-svelte';
  import { onMount } from 'svelte';
  import SessionMenu from './session-menu.svelte';

  onMount(() => {
    registerMenu('session');
    menuController.swipeGesture(false, 'session');
  });
</script>

<ion-split-pane content-id="main">
  <ion-menu content-id="main" menu-id="session">
    <SessionMenu />
  </ion-menu>
  <div id="main">
    <slot />
  </div>
</ion-split-pane>
