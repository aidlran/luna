import { KeyWorkerClusterManager } from 'key-manager';
import { getContext, setContext } from 'svelte';
import { KeysService, UsernameService } from '../services';

export interface Services {
  keysService: KeysService;
  usernameService: UsernameService;
}

export function initServices(): Services {
  const services: Services = {
    keysService: new KeysService(new KeyWorkerClusterManager()),
    usernameService: new UsernameService(),
  };

  setContext('services', services);

  // eslint-disable-next-line no-console
  console.log('Services initialised');

  return services;
}

export function getServices(): Services {
  return getContext('services');
}
