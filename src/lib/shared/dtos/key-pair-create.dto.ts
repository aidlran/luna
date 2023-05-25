import { IsString } from 'class-validator';
import type { IKeyPairCreate } from '../interfaces';

export class KeyPairCreateDTO implements IKeyPairCreate {
  @IsString()
  publicKey: string;

  @IsString()
  privateKey: string;
}
