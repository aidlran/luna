import { KeyWorkerClusterManager } from 'key-manager';
import { getContext, setContext } from 'svelte';
import { EncryptedDataApiService, SessionApiService, UserApiService } from '../api';
import { KeysService, UsernameService } from '../services';

export interface Services {
  // API
  encryptedDataApiService: EncryptedDataApiService;
  sessionApiService: SessionApiService;
  userApiService: UserApiService;

  keysService: KeysService;
  usernameService: UsernameService;
}

export function initServices(): Services {
  const sessionApiService = new SessionApiService();

  const services: Services = {
    // API
    encryptedDataApiService: new EncryptedDataApiService(),
    sessionApiService,
    userApiService: new UserApiService(),

    keysService: new KeysService(new KeyWorkerClusterManager(), sessionApiService),
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
