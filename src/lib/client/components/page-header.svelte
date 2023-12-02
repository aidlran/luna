<script lang="ts">
  import { chevronBack } from 'ionicons/icons';

  export let backHref: string | undefined = undefined;
</script>

<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      {#if backHref}
        <ion-button href={backHref}>
          <ion-icon icon={chevronBack} />
        </ion-button>
      {/if}
      <slot name="start" />
    </ion-buttons>

    <slot />
  </ion-toolbar>
</ion-header>
