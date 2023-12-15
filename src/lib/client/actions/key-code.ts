import type { Action } from 'svelte/action';
import { keyCode as fn, type KeyCodeOptions } from '../functions/key-code';

export const keyCode: Action<HTMLElement, Omit<KeyCodeOptions, 'node'>> = (node, param) => ({
  destroy: fn({ node, ...param }),
});
