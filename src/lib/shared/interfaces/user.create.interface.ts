import type { IKeyPairCreate } from './key-pair.create.interface';

export interface IUserCreate extends IKeyPairCreate {
  email: string;
  passphrase: string;
  username: string;
}
