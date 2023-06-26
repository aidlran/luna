import { Session, type ConfiguredKMS } from '@enclavetech/lib-web';
import type { KeyPair } from '@prisma/client';
import type { IEncryptedDataCreate } from '$lib/shared/interfaces';

// TODO: move session-y stuff to separate service

export class KeysService {
  // TODO: KMS should track this
  private keyIDs = new Array<string>();

  constructor(private readonly kms: ConfiguredKMS) {}

  protected async saveSession(sessionPayload?: string): Promise<void> {
    await Session.updateSessionData(sessionPayload ?? (await this.kms.session.export()).sessionPayload);
  }

  /** Try and load keys from an existing session. */
  async resumeSession(): Promise<void> {
    const retrievedSession = await Session.retrieveSessionDataPayload();

    if (retrievedSession.message) {
      await this.destroySession();
      throw new Error(retrievedSession.message);
    }

    // Import session, re-export, invalidating old key
    const importSessionResult = await this.kms.session.import({
      reexport: true,
      sessionPayload: retrievedSession.payload,
    });

    this.keyIDs.push(...importSessionResult.importedKeyIDs);

    await this.saveSession(importSessionResult.sessionPayload).catch(() => {
      /* empty */
    });
  }

  /** End any active session and destroy all session data. */
  async destroySession(): Promise<void> {
    this.keyIDs = new Array<string>();
    await Promise.allSettled([Session.destroy(), this.kms.session.destroy()]);
  }

  /**
   * Imports raw `KeyPair` items from the database into the key manager.
   * @param {string} secret The active user's passphrase.
   * @param {KeyPair[]} keyPairs Encrypted KeyPair items to import.
   */
  public async importKeyPairs(secret: string, ...keyPairs: KeyPair[]): Promise<void> {
    await Promise.all(
      keyPairs.map(async (keyPair) => {
        const { id: keyID, privateKey, publicKey } = keyPair;

        this.keyIDs.push(keyPair.id);

        return await this.kms.keys.import({
          keyID,
          privateKey,
          publicKey,
          secret,
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
      await this.kms.hybrid.decrypt({
        kmsKeyID,
        payload,
        payloadKey,
      })
    ).payload;
  }

  /**
   * @param payload A payload string to encrypt
   * @returns {Promise<IEncryptedDataCreate>} A promise that resolves with data for creating a `EncryptedData` item.
   * // TODO: this service should have no knowledge of `IEncryptedDataCreate`.
   */
  public async encrypt(payload: string): Promise<IEncryptedDataCreate> {
    const encryptResult = await this.kms.hybrid.encrypt({
      kmsKeyID: this.keyIDs[0],
      payload,
    });

    return {
      encryptedReadKey: encryptResult.payloadKey,
      ownerKeyPairID: this.keyIDs[0],
      payload: encryptResult.payload,
    };
  }

  /**
   * Creates and exports a new asymmetric key pair.
   * @param secret The exported private key will be encrypted using this secret.
   */
  generateKeyPair(secret: string): Promise<{ privateKey: string; publicKey: string }> {
    return this.kms.keys.generateKeyPair({ secret });
  }
}
