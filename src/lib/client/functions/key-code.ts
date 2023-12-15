export interface KeyCodeOptions {
  node?: HTMLElement;
  code: string[];
  activates: () => unknown;
  once?: boolean;
}

export function keyCode(options: KeyCodeOptions) {
  if (!options.code.length) {
    throw new TypeError("'code' should not be an empty array.");
  }
  if (typeof options.activates !== 'function') {
    throw new TypeError("'activates' should be a function.");
  }
  const clonedCode = [...options.code];
  const targetNode = options.node ?? document;
  let correct = 0;
  const listener = ({ key }: KeyboardEvent) => {
    if (key === clonedCode[correct]) {
      if (clonedCode.length == ++correct) {
        options.activates();
        if (options.once) {
          clonedCode.length = 0;
          targetNode.removeEventListener('keydown', listener);
        }
      } else {
        return;
      }
    }
    correct = 0;
  };
  targetNode.addEventListener('keydown', listener);
  return () => targetNode.removeEventListener('keydown', listener);
}
