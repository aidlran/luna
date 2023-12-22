import type { Action } from 'svelte/action';

export const focus: Action = (node) => node.focus();

export const ionFocus: Action<HTMLElement & { setFocus: () => unknown }, number> = (
  node,
  timeout = 0,
) => {
  setTimeout(() => node.setFocus(), timeout);
};
