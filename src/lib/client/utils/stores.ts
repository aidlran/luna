import type { ComponentType } from 'svelte';
import { writable } from 'svelte/store';

export const drawer = writable<null | {
  component: ComponentType;
  props?: object;
}>();
