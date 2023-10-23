import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
import { writable, type Readable } from 'svelte/store';

export interface DrawerState {
  component?: ComponentType;
  props?: ComponentProps<SvelteComponent>;
  isOpen: boolean;
}

export interface DrawerControl extends Readable<DrawerState> {
  close: () => void;
  open: <T extends SvelteComponent>(component: ComponentType<T>, props?: ComponentProps<T>) => void;
}

export function drawerControl(): DrawerControl {
  const { set, subscribe } = writable<DrawerState>({ isOpen: false });

  function close() {
    set({ isOpen: false });
  }

  function open<T extends SvelteComponent>(component: ComponentType<T>, props?: ComponentProps<T>) {
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
