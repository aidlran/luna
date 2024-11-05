import type { Component, ComponentProps, SvelteComponent } from 'svelte';
import { writable, type Readable } from 'svelte/store';

export interface DrawerState {
  component?: Component;
  props?: ComponentProps<SvelteComponent>;
  isOpen: boolean;
}

export interface DrawerControl extends Readable<DrawerState> {
  close: () => void;
  open: <T extends Component>(component: T, props?: ComponentProps<T>) => void;
}

export function drawerControl(): DrawerControl {
  const { set, subscribe } = writable<DrawerState>({ isOpen: false });

  function close() {
    set({ isOpen: false });
  }

  function open<T extends Component>(component: T, props?: ComponentProps<T>) {
    set({
      component,
      props,
      isOpen: true,
    });
  }

  return {
    close,
    open,
    subscribe,
  };
}
