import type { IUserCreate, IUserMe } from '$lib/shared/interfaces';
import type { IApiMaybeErrorResponse } from '../interfaces/api-error-response';
import { ApiService } from './api.service';

export class UserApiService extends ApiService {
  constructor() {
    super('user');
  }

  public createUser(data: IUserCreate): Promise<{ user: IUserMe } & IApiMaybeErrorResponse> {
    return this.POST<IUserCreate, { user: IUserMe }>('', data);
  }
}
