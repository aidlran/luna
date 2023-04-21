import type { IUserSanitised } from '$lib/server/user';

export interface ISessionContext {
  user: IUserSanitised;
  sessionID?: string;
}
