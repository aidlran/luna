import { KeyWorkerClusterManager } from 'key-manager';
import { getContext, setContext } from 'svelte';
import { EncryptedDataApiService, MeApiService, SessionApiService, UserApiService } from '../api';
import { KeysService, UsernameService } from '../services';

export interface Services {
  // API
  encryptedDataApiService: EncryptedDataApiService;
  meApiService: MeApiService;
  sessionApiService: SessionApiService;
  userApiService: UserApiService;

  keysService: KeysService;
  usernameService: UsernameService;
}

export function initServices(): Services {
  const sessionApiService = new SessionApiService();
  const keysService = new KeysService(new KeyWorkerClusterManager(), sessionApiService);

  const services: Services = {
    // API
    encryptedDataApiService: new EncryptedDataApiService(),
    meApiService: new MeApiService(keysService),
    sessionApiService,
    userApiService: new UserApiService(),

    keysService,
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
