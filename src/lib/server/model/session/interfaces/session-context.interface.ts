import type { IUserSanitised } from '$lib/shared/types';

export interface ISessionContext {
  user: IUserSanitised;
  sessionID?: string;
}
