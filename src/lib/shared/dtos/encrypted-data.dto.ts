import { IsString } from 'class-validator';
import type { IEncryptedDataCreate } from '../types';

export class EncryptedDataCreateDTO implements IEncryptedDataCreate {
  @IsString()
  encryptedPayload: string;

  @IsString()
  keyPairId: string;
}
