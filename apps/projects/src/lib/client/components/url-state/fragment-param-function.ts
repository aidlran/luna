import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';

export const fragmentParam = (key: string): Writable<string | undefined> => {
  return getContext<(key: string) => Writable<string | undefined>>('fragmentParam')(key);
};
