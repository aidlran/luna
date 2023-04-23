import type { IModelIdResponse } from '$lib/shared/interfaces';
import type { IEncryptedDataCreate } from '$lib/shared/types';
import type { EncryptedData } from '@prisma/client';
import type { IApiMaybeErrorResponse } from '../interfaces/api-error-response';
import { ApiService } from './api.service';
import type { KeysService } from '$lib/client/services';

export class MeApiService extends ApiService {
  constructor(private readonly keysService: KeysService) {
    super('me');
  }

  public async createEncryptedData(message: string): Promise<IModelIdResponse & IApiMaybeErrorResponse> {
    const encryptedData = await this.keysService.encrypt(message);
    return super.POST<IEncryptedDataCreate, IModelIdResponse>('encrypted-data', encryptedData);
  }

  public getAllEncryptedData(): Promise<EncryptedData[] & IApiMaybeErrorResponse> {
    return super.GET<EncryptedData[]>('encrypted-data');
  }
}
