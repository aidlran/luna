import type { KeyPair } from '@prisma/client';
import type { KeyManager } from 'key-manager';
import { decryptKey, readPrivateKey } from 'openpgp';
import type { SessionApiService } from '../api';

// TODO: move session-y stuff to seperate service

export class KeysService {
  constructor(
    private readonly keyManager: KeyManager,
    private readonly sessionApiService: SessionApiService,
  ) {}

  protected async importKeyPair(keyPair: KeyPair, passphrase: string): Promise<void> {
    const { id, privateKey: armoredKey } = keyPair;
    const privateKey = await readPrivateKey({ armoredKey });
    const decryptedKey = await decryptKey({ privateKey, passphrase });
    await this.keyManager.importKey(decryptedKey.armor(), id);
  }

  protected async saveSession(): Promise<void> {
    const { data } = await this.keyManager.exportSession();
    await this.sessionApiService.updateData({ payload: data });
  }

  /**
   * Try and load keys from an existing session.
   */
  public async resumeSession(): Promise<void> {
    const session = await this.sessionApiService.get();

    if (session.message) {
      await this.sessionApiService.destroy();
      throw new Error(session.message);
    }

    await this.keyManager.importSession(session.payload);
    await this.saveSession().catch(() => {
      /* empty */
    });
  }

  /**
   * End any active session and destroy all session data.
   */
  public async destroySession(): Promise<void> {
    await Promise.allSettled([this.sessionApiService.destroy(), this.keyManager.destroySession()]);
  }

  /**
   * Imports raw KeyPair items from the database into the key manager.
   * @param {string} passphrase The active user's passphrase.
   * @param {KeyPair[]} keyPairs Encrypted KeyPair items to import.
   */
  public async import(passphrase: string, ...keyPairs: KeyPair[]): Promise<void> {
    await Promise.all(keyPairs.map((keyPair) => this.importKeyPair(keyPair, passphrase)));
    await this.saveSession().catch(() => {
      /* empty */
    });
  }
}
