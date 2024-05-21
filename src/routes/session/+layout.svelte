<script>
  import 'ionic-svelte/components/ion-button.js';
  import 'ionic-svelte/components/ion-card.js';
  import 'ionic-svelte/components/ion-card-header.js';
  import 'ionic-svelte/components/ion-card-subtitle.js';
  import 'ionic-svelte/components/ion-card-title.js';
  import 'ionic-svelte/components/ion-content.js';
  import 'ionic-svelte/components/ion-input.js';
  import { onDestroy } from 'svelte';
  import { fragmentParam } from '$lib/client/components/url-state';

  const thenParam = fragmentParam('then');

  onDestroy(() => thenParam.set(undefined));
</script>

<svelte:head>
  <title>Sessions | LUNA</title>
  <meta name="description" content="Manage local sessions in your LUNA client." />
</svelte:head>

<div class="ion-page">
  <ion-toolbar color="warning" style="text-align:center">
    <ion-text>
      Using a pre-pre-release of <a
        href="https://github.com/aidlran/librebase/tree/main/packages/keyrings"
        target="_blank"
        rel="noreferrer noopener">@librebase/keyrings</a
      > - a work in progress and not yet considered stable or well tested!
    </ion-text>
  </ion-toolbar>
  <slot />
</div>
