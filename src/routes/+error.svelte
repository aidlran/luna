<script>
  import 'ionic-svelte/components/ion-back-button';
  import 'ionic-svelte/components/ion-button';
  import 'ionic-svelte/components/ion-header';
  import 'ionic-svelte/components/ion-title';
  import 'ionic-svelte/components/ion-toolbar';
</script>

<ion-header>
  <ion-toolbar slot="start">
    <ion-title>Page Not Found</ion-title>
    <ion-buttons slot="secondary">
      <ion-back-button />
    </ion-buttons>
    <ion-buttons slot="primary">
      <ion-button href="/">Home</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
