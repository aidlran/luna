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

  return setContext('services', services);
}

export function getServices(): Services {
  return getContext('services');
}
