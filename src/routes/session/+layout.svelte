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
  <slot />
</div>
