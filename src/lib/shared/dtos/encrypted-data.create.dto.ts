import { IsString } from 'class-validator';
import type { IEncryptedDataCreate } from '../interfaces/encrypted-data.create.interface';

export class EncryptedDataCreateDTO implements IEncryptedDataCreate {
  @IsString()
  payload: string;

  @IsString()
  ownerKeyPairID: string;

  @IsString()
  encryptedReadKey: string;
}
