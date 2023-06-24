import { KMS, EncryptedData } from '@enclavetech/lib-web';
import { getContext, setContext } from 'svelte';
import { MeApiService, SessionApiService, UserApiService } from '../api';
import { KeysService, UsernameService } from '../services';

export interface Services {
  encryptedDataService: EncryptedData;
  meApiService: MeApiService;
  sessionApiService: SessionApiService;
  userApiService: UserApiService;

  keysService: KeysService;
  usernameService: UsernameService;
}

export function initServices(): Services {
  const sessionApiService = new SessionApiService();
  const keysService = new KeysService(KMS(), sessionApiService);

  return setContext<Services>('services', {
    encryptedDataService: new EncryptedData(),
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
