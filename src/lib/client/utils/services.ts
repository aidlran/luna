import { createConfiguredKMS } from '@enclavetech/lib-web';
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
  const keysService = new KeysService(createConfiguredKMS(), sessionApiService);

  return setContext<Services>('services', {
    // API
    encryptedDataApiService: new EncryptedDataApiService(),
    meApiService: new MeApiService(keysService),
    sessionApiService,
    userApiService: new UserApiService(),

    keysService,
    usernameService: new UsernameService(),
  });
}

export function getServices(): Services {
  return getContext<Services>('services');
}
