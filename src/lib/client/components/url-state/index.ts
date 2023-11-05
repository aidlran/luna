import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';
import UrlState from './url-state.svelte';

export { UrlState };

export function fragmentParam(key: string): Writable<string | undefined> {
  return getContext<(key: string) => Writable<string | undefined>>('fragmentParam')(key);
}
