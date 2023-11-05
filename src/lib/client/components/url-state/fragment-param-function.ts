import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';
import type { FragmentParamKey } from './fragment-param-key';

export function fragmentParam(key: FragmentParamKey): Writable<string | undefined> {
  return getContext<(key: FragmentParamKey) => Writable<string | undefined>>('fragmentParam')(key);
}
