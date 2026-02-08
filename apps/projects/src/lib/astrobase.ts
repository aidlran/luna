import { createMemo, createResource, createSignal } from 'solid-js';
import { Common } from '@astrobase/sdk/common';
import { WithWebCryptoCrypt } from '@astrobase/sdk/crypt/web-crypto';
import { indexeddb } from '@astrobase/sdk/indexeddb';
import { createInstance } from '@astrobase/sdk/instance';
import { WithWebCryptoKDF } from '@astrobase/sdk/kdf/web-crypto';

/**
 * The base Astrobase config. The application derives a reactive final config value with user
 * configuration on top.
 */
const baseConfig = createResource(async () =>
  createInstance(Common, WithWebCryptoCrypt, WithWebCryptoKDF, {
    clients: [{ strategy: await indexeddb() }],
  }),
)[0];

export const [keyringUnlocked, setKeyringUnlocked] = createSignal(false);

export const [selectedKeyring, setSelectedKeyring] = createSignal<number>();

/** The reactive merged Astrobase config. We'll add a source signal with the user's configuration. */
export const instance = createMemo(() => baseConfig());
