import type { KeyPair } from '@prisma/client';
import type { KeyManager } from 'key-manager';
import { decryptKey, readPrivateKey } from 'openpgp';

export class KeysService {
  constructor(private readonly keyManager: KeyManager) {}

  protected async importKeyPair(keyPair: KeyPair, passphrase: string): Promise<void> {
    const { id, privateKey: armoredKey } = keyPair;
    const privateKey = await readPrivateKey({ armoredKey });
    const decryptedKey = await decryptKey({ privateKey, passphrase });
    await this.keyManager.importKey(decryptedKey.armor(), id);
  }

  /**
   * Try and load keys from the saved session.
   */
  public async resumeSession(): Promise<void> {
    // TODO: GET /api/session
    const session = localStorage.getItem('tmp_session');
    if (session) await this.keyManager.importSession(session);
  }

  public async destroySession(): Promise<void> {
    // TODO: DELETE /api/session
    localStorage.removeItem('tmp_session');
    await this.keyManager.destroySession();
  }

  /**
   * Imports raw KeyPair items from the database into the key manager.
   * @param {string} passphrase The active user's passphrase.
   * @param {KeyPair[]} keyPairs Encrypted KeyPair items to import.
   */
  public async import(passphrase: string, ...keyPairs: KeyPair[]): Promise<void> {
    await Promise.all(keyPairs.map((keyPair) => this.importKeyPair(keyPair, passphrase)));

    const { data } = await this.keyManager.exportSession();

    // TODO: POST /api/session
    localStorage.setItem('tmp_session', data);
  }
}
