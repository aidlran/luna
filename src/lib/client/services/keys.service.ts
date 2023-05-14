import type { KMS } from '@enclavetech/kms-core';
import type { KeyPair } from '@prisma/client';
import { decryptKey, readPrivateKey } from 'openpgp';
import type { IEncryptedDataCreate } from '$lib/shared/interfaces';
import type { SessionApiService } from '../api';

// TODO: move session-y stuff to separate service

export class KeysService {
  private readonly keyIDs = new Array<string>();

  constructor(
    // multi-line pls, prettier
    private readonly kms: KMS,
    private readonly sessionApiService: SessionApiService,
  ) {}

  protected async saveSession(sessionPayload?: string): Promise<void> {
    await this.sessionApiService.updateData({
      payload: sessionPayload ?? (await this.kms.exportSession()).sessionPayload,
    });
  }

  /** Try and load keys from an existing session. */
  async resumeSession(): Promise<void> {
    const fetchedSession = await this.sessionApiService.get();

    if (fetchedSession.message) {
      await this.sessionApiService.destroy();
      throw new Error(fetchedSession.message);
    }

    // Import session, re-export, invalidating old key
    const importSessionResult = await this.kms.importSession({
      reexport: true,
      sessionPayload: fetchedSession.payload,
    });

    this.keyIDs.push(...importSessionResult.importedKeyIDs);

    await this.saveSession(importSessionResult.sessionPayload).catch(() => {
      /* empty */
    });
  }

  /** End any active session and destroy all session data. */
  async destroySession(): Promise<void> {
    await Promise.allSettled([this.sessionApiService.destroy(), this.kms.destroySession()]);
  }

  /**
   * Imports raw `KeyPair` items from the database into the key manager.
   * @param {string} passphrase The active user's passphrase.
   * @param {KeyPair[]} keyPairs Encrypted KeyPair items to import.
   */
  public async importKeyPairs(passphrase: string, ...keyPairs: KeyPair[]): Promise<void> {
    await Promise.all(
      keyPairs.map(async (keyPair) => {
        const { id: keyID, privateKey: armoredKey } = keyPair;
        const privateKey = await readPrivateKey({ armoredKey });
        const decryptedKey = await decryptKey({ privateKey, passphrase });
        this.keyIDs.push(keyPair.id);
        return await this.kms.importPrivateKeys({
          keyID,
          privateKey: decryptedKey.armor(),
        });
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
   * @param {string} payload String payload to encrypt.
   * @returns {Promise<IEncryptedDataCreate>} A promise that resolves with data for creating a `EncryptedData` item.
   */
  public async encrypt(payload: string): Promise<IEncryptedDataCreate> {
    const encryptResult = await this.kms.hybridEncrypt({
      kmsKeyID: this.keyIDs[0],
      payload,
    });

    return {
      encryptedReadKey: encryptResult.payloadKey,
      ownerKeyPairID: this.keyIDs[0],
      payload: encryptResult.payload,
    };
  }
}
