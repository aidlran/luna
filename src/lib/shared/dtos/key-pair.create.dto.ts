import { IsAscii, Length } from 'class-validator';
import type { IKeyPairCreate } from '../interfaces';

// TODO: class validator rule to match public and private armored PGP keys

export class KeyPairCreateDTO implements IKeyPairCreate {
  @IsAscii()
  @Length(590, 690)
  publicKey: string;

  @IsAscii()
  @Length(810, 910)
  privateKey: string;
}
