import { KeyWorkerClusterManager } from 'key-manager';
import { getContext, setContext } from 'svelte';
import { KeysService } from '../services';

export interface Services {
  keysService: KeysService;
}

export function initServices(): Services {
  const keyManager = new KeyWorkerClusterManager();
  const keysService = new KeysService(keyManager);

  const services: Services = {
    keysService,
  };

  setContext('services', services);

  // eslint-disable-next-line no-console
  console.log('Services initialised');

  return services;
}

export function getServices(): Services {
  return getContext('services');
}
