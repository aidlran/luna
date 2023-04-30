import type { KeyPair } from '@prisma/client';
import type { KeyManager } from 'key-manager';
import { decryptKey, readPrivateKey } from 'openpgp';
import type { SessionApiService } from '../api';
import type { IEncryptedDataCreate } from '$lib/shared/interfaces';

// TODO: move session-y stuff to separate service

export class KeysService {
  private readonly keyIDs = new Array<string>();

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

    // Import session, take returned imported keyIDs and add to our array
    const { data } = await this.keyManager.importSession(session.payload);
    this.keyIDs.push(...data);

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
   * Imports raw `KeyPair` items from the database into the key manager.
   * @param {string} passphrase The active user's passphrase.
   * @param {KeyPair[]} keyPairs Encrypted KeyPair items to import.
   */
  public async import(passphrase: string, ...keyPairs: KeyPair[]): Promise<void> {
    await Promise.all(
      keyPairs.map((keyPair) => {
        this.keyIDs.push(keyPair.id);
        return this.importKeyPair(keyPair, passphrase);
      }),
    );
    await this.saveSession().catch(() => {
      /* empty */
    });
  }

  // TODO: move following to own `EncryptedData` service

  /**
   * Decrypt a message.
   * @param {string} payload Encrypted armored message string.
   * @param {string} messageKey Encrypted key used to decrypt the message.
   * @param {string} keyPairID ID of the `KeyPair` that encrypted the `messageKey`.
   * @returns {Promise<string>} The decrypted payload string.
   */
  public async decrypt(payload: string, messageKey: string, keyPairID: string): Promise<string> {
    const { data } = await this.keyManager.hybridDecrypt(payload, messageKey, keyPairID);

    return data;
  }

  /**
   * Encrypt a message.
   * @param {string} message
   * @returns {Promise<IEncryptedDataCreate>} A promise that resolves with data for creating a `EncryptedData` item.
   */
  public async encrypt(message: string): Promise<IEncryptedDataCreate> {
    const encryptResult = await this.keyManager.hybridEncrypt(this.keyIDs[0], message);

    return {
      encryptedReadKey: encryptResult.data.key,
      ownerKeyPairID: encryptResult.keyID,
      payload: encryptResult.data.message,
    };
  }
}
