import type { KeyPair } from '@prisma/client';
import type { IKeyManager } from 'key-manager';
import { decryptKey, readPrivateKey } from 'openpgp';

export class KeysService {
  constructor(private readonly keyManager: IKeyManager) {}

  public importKeyPairs(keyPairs: KeyPair[], passphrase: string) {
    return Promise.all(
      keyPairs.map((keyPair) =>
        readPrivateKey({ armoredKey: keyPair.privateKey })
          .then((privateKey) => decryptKey({ privateKey, passphrase }))
          .then((decryptedKey) => this.keyManager.importKey(decryptedKey, keyPair.id))
      )
    );
  }
}
