import { getContext } from 'svelte';
import type { DrawerControl } from './drawer-control';

import Drawer from './drawer.svelte';
export { Drawer, type DrawerControl };

/**
 * Retrieves a drawer control store. As it is using the Svelte context API, it must be called during component initialisation.
 * @param key The target drawer component's key.
 */
export function drawerControl(key = 'default'): DrawerControl {
  return getContext<DrawerControl>(`drawerControl.${key}`);
}
