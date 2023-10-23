<script lang="ts">
  import { setContext } from 'svelte';
  import { drawerControl } from './drawer-control';

  /**
   * The identifer for the drawer. Used when accessing the `drawerControl()`.
   */
  export let key = 'default';

  // TODO: move following props to drawerControl store.
  // TODO: different positions, i.e. left.

  /**
   * Whether the drawer will dim the background while open.
   */
  export let dim = true;

  /**
   * Whether the user can click through to background elements while drawer is open.
   */
  export let clickthrough = true;

  /**
   * Drawer opening/closing transition duration in milliseconds.
   */
  export let transitionDuration = 200;

  /**
   * Width of the drawer.
   */
  export let width = '30%';

  /**
   * Minimum width of the drawer.
   */
  export let minWidth = '300px';

  /**
   * Padding of drawer inner elements.
   */
  export let padding = '16px';

  const control = drawerControl();
  setContext(`drawerControl.${key}`, control);
</script>

<div
  role="none"
  style:min-height="100vh"
  style:--transition-duration={`${transitionDuration}ms`}
  on:click={control.close}
>
  <slot />

  <div
    class="overlay"
    style:background-color={dim && $control.isOpen ? '#0002' : '#0000'}
    style:pointer-events={$control.isOpen && !clickthrough ? 'initial' : 'none'}
  />

  <div
    role="none"
    class="drawer"
    style:right={$control.isOpen ? 0 : 'var(--right-opened)'}
    style:--width={width}
    style:--min-width={minWidth}
    style:--padding={padding}
    on:click|stopPropagation
  >
    {#if $control.isOpen}
      <button class="close" on:click={control.close}>X</button>
      <svelte:component this={$control.component} {...$control.props} />
    {/if}
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    transition: background-color var(--transition-duration) ease;
  }

  .drawer {
    --right-opened: calc(0px - max(calc(var(--min-width) + var(--padding) * 2), var(--width)));
    position: fixed;
    top: 0;
    height: calc(100vh - calc(var(--padding) * 6));
    overflow-y: scroll;
    width: calc(100% - calc(var(--padding) * 2));
    min-width: var(--min-width);
    max-width: calc(var(--width) - calc(var(--padding) * 2));
    padding: calc(var(--padding) * 3) var(--padding);
    background: rgba(var(--colour-background), 0.9);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    box-shadow: var(--shadow);
    transition: right var(--transition-duration) ease;
  }

  button.close {
    position: absolute;
    top: 16px;
    right: 16px;
  }
</style>
