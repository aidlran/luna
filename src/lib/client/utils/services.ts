import { KMS } from '@enclavetech/lib-web';
import { getContext, setContext } from 'svelte';
import { MeApiService, UserApiService } from '../api';
import { KeysService, UsernameService } from '../services';

export interface Services {
  meApiService: MeApiService;
  userApiService: UserApiService;

  keysService: KeysService;
  usernameService: UsernameService;
}

export function initServices(): Services {
  const keysService = new KeysService(KMS());

  return setContext<Services>('services', {
    meApiService: new MeApiService(keysService),
    userApiService: new UserApiService(),

    keysService,
    usernameService: new UsernameService(),
  });
}

export function getServices(): Services {
  return getContext<Services>('services');
}
