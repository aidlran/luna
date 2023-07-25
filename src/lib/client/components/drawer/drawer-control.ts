import { writable, type Readable } from 'svelte/store';
import type { DrawerState } from './drawer-state';
import type { ComponentType } from 'svelte';

export interface DrawerControl extends Readable<DrawerState> {
  close: () => void;
  open: (component: ComponentType, props?: object) => void;
}

export function drawerControl(): DrawerControl {
  const { set, subscribe } = writable<DrawerState>();

  function close() {
    set({});
  }

  function open(component: ComponentType, props?: object) {
    set({
      component,
      props: props ?? {},
    });
  }

  return {
    close,
    open,
    subscribe,
  };
}
