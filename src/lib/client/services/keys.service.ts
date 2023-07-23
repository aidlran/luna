import { Session } from '@enclavetech/lib-web';
import type { KeyPair } from '@prisma/client';

// TODO: move session-y stuff to separate service

export class KeysService {
  // TODO: KMS should track this
  private keyIDs = new Array<string>();

  get defaultKey() {
    return this.keyIDs[0];
  }

  /** Try and load keys from an existing session. */
  async resumeSession(): Promise<void> {
    const importedKeyIDs = await Session.resume();
    this.keyIDs.push(...importedKeyIDs);
  }

  /** End any active session and destroy all session data. */
  async destroySession(): Promise<void> {
    this.keyIDs = new Array<string>();
    await Session.destroy();
  }

  public async importKeyPairs(keyPairs: KeyPair[]): Promise<void> {
    for (const { id } of keyPairs) {
      this.keyIDs.push(id);
    }
  }
}
