<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { DrawerControl } from './drawer-control';
  import type { DrawerState } from './drawer-state';

  export let control: DrawerControl;

  let isOpen = false;

  const baseTransitionDuration = 200;
  let currentTransitionDuration = baseTransitionDuration;

  let state: DrawerState = {};

  const unsubscribe = control.subscribe((value) => {
    if (!value?.component) {
      close();
      return;
    }

    value.props = value.props ?? {};

    if (!isOpen) {
      open(value);
      return;
    }

    currentTransitionDuration = 50;
    isOpen = false;
    setTimeout(() => {
      currentTransitionDuration = baseTransitionDuration;
      open(value);
    }, currentTransitionDuration);
  });

  function open(value: DrawerState) {
    state = value;
    isOpen = true;
  }

  function close() {
    state = {};
    isOpen = false;
  }

  onDestroy(unsubscribe);
</script>

<div
  role="none"
  class="drawer"
  tabindex="-1"
  style:right={isOpen ? 0 : '-300px'}
  style:transition-duration={`${baseTransitionDuration}ms`}
  on:click|stopPropagation
  on:keypress
>
  <button class="close" on:click|stopPropagation={close}>X</button>
  <svelte:component this={state.component} {...state.props} />
</div>

<style>
  .drawer {
    --padding: 16px;
    --padding-x2: calc(var(--padding) * 2);

    position: absolute;
    height: calc(100% - var(--padding-x2));
    width: calc(100% - var(--padding-x2));
    max-width: calc(300px - var(--padding-x2));
    padding: var(--padding);
    background: rgba(var(--colour-background), 0.9);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    box-shadow: var(--shadow);
    transition: right ease;
  }

  button.close {
    position: absolute;
    top: 16px;
    right: 16px;
  }
</style>
