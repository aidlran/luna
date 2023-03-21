import { IsBase64 } from 'class-validator';

export class KeyPairCreateDTO {
  @IsBase64()
  publicKey: string;

  @IsBase64()
  privateKey: string;
}
