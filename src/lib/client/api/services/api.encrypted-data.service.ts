import type { IModelIdResponse } from '$lib/shared/interfaces';
import type { IEncryptedDataCreate } from '$lib/shared/types';
import type { EncryptedData } from '@prisma/client';
import type { IApiMaybeErrorResponse } from '../interfaces/api-error-response';
import { ApiService } from './api.service';

export class EncryptedDataApiService extends ApiService {
  constructor() {
    super('encrypted-data');
  }

  public create(data: IEncryptedDataCreate): Promise<IModelIdResponse & IApiMaybeErrorResponse> {
    return super.POST<IEncryptedDataCreate, IModelIdResponse>('', data);
  }

  public getOne(id: string): Promise<EncryptedData & IApiMaybeErrorResponse> {
    return super.GET<EncryptedData>(id);
  }
}
