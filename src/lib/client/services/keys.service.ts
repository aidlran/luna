import type { KMS } from '@enclavetech/kms-core';
import type { KeyPair } from '@prisma/client';
import { decryptKey, readPrivateKey } from 'openpgp';
import type { IEncryptedDataCreate } from '$lib/shared/interfaces';
import type { SessionApiService } from '../api';

// TODO: move session-y stuff to separate service

export class KeysService {
  private readonly keyIDs = new Array<string>();

  constructor(private readonly kms: KMS, private readonly sessionApiService: SessionApiService) {}

  protected async importKeyPair(keyPair: KeyPair, passphrase: string): Promise<void> {
    const { id: keyID, privateKey: armoredKey } = keyPair;
    const privateKey = await readPrivateKey({ armoredKey });
    const decryptedKey = await decryptKey({ privateKey, passphrase });
    await this.kms.importKey({
      keyID,
      key: decryptedKey.armor(),
    });
  }

  protected async saveSession(): Promise<void> {
    const { payload } = await this.kms.exportSession();
    await this.sessionApiService.updateData({ payload });
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
    const { payload } = await this.kms.importSession(session.payload);
    this.keyIDs.push(...payload);

    await this.saveSession().catch(() => {
      /* empty */
    });
  }

  /**
   * End any active session and destroy all session data.
   */
  public async destroySession(): Promise<void> {
    await Promise.allSettled([this.sessionApiService.destroy(), this.kms.destroySession()]);
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
   * @param {string} payloadKey Encrypted key used to decrypt the message.
   * @param {string} kmsKeyID ID of the `KeyPair` that encrypted the `payloadKey`.
   * @returns {Promise<string>} The decrypted payload string.
   */
  public async decrypt(payload: string, payloadKey: string, kmsKeyID: string): Promise<string> {
    return (
      await this.kms.hybridDecrypt({
        kmsKeyID,
        payload,
        payloadKey,
      })
    ).payload;
  }

  /**
   * Encrypt a message.
   * @param {string} payload
   * @returns {Promise<IEncryptedDataCreate>} A promise that resolves with data for creating a `EncryptedData` item.
   */
  public async encrypt(payload: string): Promise<IEncryptedDataCreate> {
    const encryptResult = await this.kms.hybridEncrypt({
      kmsKeyID: this.keyIDs[0],
      payload,
    });

    return {
      encryptedReadKey: encryptResult.payload.payloadKey,
      ownerKeyPairID: this.keyIDs[0],
      payload: encryptResult.payload.payload,
    };
  }
}
