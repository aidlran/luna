import type { ISessionCreate, IUserMe } from '$lib/shared/interfaces';
import type { IApiMaybeErrorResponse } from '../interfaces/api-error-response';
import { ApiService } from './api.service';

export class SessionApiService extends ApiService {
  constructor() {
    super('session');
  }

  public createSession(data: ISessionCreate): Promise<{ user: IUserMe } & IApiMaybeErrorResponse> {
    return this.post<ISessionCreate, { user: IUserMe }>('', data);
  }
}
