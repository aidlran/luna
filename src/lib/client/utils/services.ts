import { KeyManager, type IKeyManager } from 'key-manager';
import { getContext, setContext } from 'svelte';

export interface Services {
  keyManager: IKeyManager;
}

export function initServices(): Services {
  const services: Services = {
    keyManager: KeyManager(),
  };

  return setContext('services', services);
}

export function getServices(): Services {
  return getContext('services');
}
