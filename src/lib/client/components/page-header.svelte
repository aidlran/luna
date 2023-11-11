<script lang="ts">
  import { chevronBack } from 'ionicons/icons';
  import SessionSwitcher from './session-switcher.svelte';

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

    <ion-buttons slot="end">
      <slot name="end" />
      <div class="wide-only">
        <SessionSwitcher />
      </div>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
