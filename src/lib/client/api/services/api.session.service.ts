import type { ISessionCreate, ISessionDataUpdate, IUserMe } from '$lib/shared/interfaces';
import type { IApiMaybeErrorResponse } from '../interfaces/api-error-response';
import { ApiService } from './api.service';

export class SessionApiService extends ApiService {
  constructor() {
    super('session');
  }

  public create(data: ISessionCreate): Promise<{ user: IUserMe } & IApiMaybeErrorResponse> {
    return super.POST<ISessionCreate, { user: IUserMe }>('', data);
  }

  public destroy(): Promise<object & IApiMaybeErrorResponse> {
    return super.DELETE();
  }

  public get(): Promise<ISessionDataUpdate & IApiMaybeErrorResponse> {
    return super.GET();
  }

  public updateData(data: ISessionDataUpdate): Promise<object & IApiMaybeErrorResponse> {
    return super.PUT('', data);
  }
}
