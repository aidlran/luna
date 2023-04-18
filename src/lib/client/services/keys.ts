import type { KeyPair } from '@prisma/client';
import type { KeyManager } from 'key-manager';
import { decryptKey, readPrivateKey } from 'openpgp';

export class KeysService {
  constructor(private readonly keyManager: KeyManager) {}

  protected async importKeyPair(keyPair: KeyPair, passphrase: string): Promise<void> {
    const { id, privateKey: armoredKey } = keyPair;
    const privateKey = await readPrivateKey({ armoredKey });
    const decryptedKey = await decryptKey({ privateKey, passphrase });
    await this.keyManager.importKey(decryptedKey, id);
  }

  public async import(passphrase: string, ...keyPairs: KeyPair[]): Promise<void> {
    await Promise.all(keyPairs.map((keyPair) => this.importKeyPair(keyPair, passphrase)));
  }
}
