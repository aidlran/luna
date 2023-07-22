import { KMS } from '@enclavetech/lib-web';
import { getContext, setContext } from 'svelte';
import { KeysService, UsernameService } from '../services';

export interface Services {
  keysService: KeysService;
  usernameService: UsernameService;
}

export function initServices(): Services {
  const keysService = new KeysService(KMS());

  return setContext<Services>('services', {
    keysService,
    usernameService: new UsernameService(),
  });
}

export function getServices(): Services {
  return getContext<Services>('services');
}
