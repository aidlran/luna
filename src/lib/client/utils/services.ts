import { getContext, setContext } from 'svelte';
import { UsernameService } from '../services';

export interface Services {
  usernameService: UsernameService;
}

export function initServices(): Services {
  return setContext<Services>('services', {
    usernameService: new UsernameService(),
  });
}

export function getServices(): Services {
  return getContext<Services>('services');
}
