import type { EncryptedDataWithKeysResponse } from '$lib/shared/interfaces';
import type { IApiMaybeErrorResponse } from '../interfaces/api-error-response';
import { ApiService } from './api.service';

export class EncryptedDataApiService extends ApiService {
  constructor() {
    super('encrypted-data');
  }

  public getOne(id: string): Promise<EncryptedDataWithKeysResponse & IApiMaybeErrorResponse> {
    return super.GET<EncryptedDataWithKeysResponse>(id);
  }

  public async deleteOne(id: string): Promise<IApiMaybeErrorResponse> {
    return super.DELETE(id);
  }
}
