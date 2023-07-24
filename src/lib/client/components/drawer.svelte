<script lang="ts">
  import { onDestroy, type ComponentType } from 'svelte';
  import { drawer } from '../utils/stores';

  let isOpen = false;
  const baseTransitionDuration = 200;
  let currentTransitionDuration = 200;
  let component: ComponentType;
  let props: object;

  const unsubscribe = drawer.subscribe((value) => {
    function open() {
      if (value) {
        component = value.component;
        props = value.props || {};
        isOpen = true;
      }
    }

    if (isOpen) {
      currentTransitionDuration = 50;
      isOpen = false;
      setTimeout(() => {
        currentTransitionDuration = baseTransitionDuration;
        open();
      }, currentTransitionDuration);
    } else {
      open();
    }
  });

  onDestroy(unsubscribe);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="drawer"
  tabindex="-1"
  style:right={isOpen ? 0 : '-300px'}
  style:transition-duration={`${baseTransitionDuration}ms`}
  on:click|stopPropagation
  on:keypress
>
  <button class="close" on:click|stopPropagation={() => (isOpen = false)}>X</button>
  <svelte:component this={component} {...props} />
</div>

<style>
  .drawer {
    --padding: 16px;
    --padding-x2: calc(var(--padding) * 2);

    position: fixed;
    height: calc(100vh - var(--padding-x2));
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
