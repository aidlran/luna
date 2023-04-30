import type {
  EncryptedDataWithKeysResponse,
  IEncryptedDataCreate,
  IModelIdResponse,
} from '$lib/shared/interfaces';
import type { KeysService } from '../../services';
import type { IApiMaybeErrorResponse } from '../interfaces/api-error-response';
import { ApiService } from './api.service';

export class MeApiService extends ApiService {
  constructor(private readonly keysService: KeysService) {
    super('me');
  }

  public async createEncryptedData(message: string): Promise<IModelIdResponse & IApiMaybeErrorResponse> {
    const encryptedData = await this.keysService.encrypt(message);
    return super.POST<IEncryptedDataCreate, IModelIdResponse>('encrypted-data', encryptedData);
  }

  public getAllEncryptedData(): Promise<EncryptedDataWithKeysResponse[] & IApiMaybeErrorResponse> {
    return super.GET<EncryptedDataWithKeysResponse[]>('encrypted-data');
  }
}
