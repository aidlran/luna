import { json } from '@librebase/codec-json/recommended';
import { getChannels, IdentifierRegistry } from '@librebase/core';
import { indexeddb } from '@librebase/driver-indexeddb';
import { CodecRegistry, FS } from '@librebase/fs';

export let mainInstanceID: undefined;
export const localOnlyInstanceID = 'localonly';

export function initInstances() {
  IdentifierRegistry.register(FS, { instanceID: mainInstanceID });
  IdentifierRegistry.register(FS, { instanceID: localOnlyInstanceID });
  const jsonCodec = json();
  CodecRegistry.register(jsonCodec, { instanceID: mainInstanceID });
  CodecRegistry.register(jsonCodec, { instanceID: localOnlyInstanceID });
  return indexeddb().then((driver) => {
    getChannels(mainInstanceID).push(driver);
    getChannels(localOnlyInstanceID).push(driver);
  });
}
