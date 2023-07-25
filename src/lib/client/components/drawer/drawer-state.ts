import type { ComponentType } from 'svelte';

export interface DrawerState {
  component?: ComponentType;
  props?: object;
}
