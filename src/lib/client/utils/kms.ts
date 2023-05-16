import { HybridNS, KeysNS, SessionNS } from '@enclavetech/kms-core';
import { KMS } from '@enclavetech/kms-openpgp';

export type ConfiguredKMS = KMS & {
  hybrid: HybridNS;
  keys: KeysNS;
  session: SessionNS;
};

export function createConfiguredKMS() {
  return new KMS({
    clusterSize: 2,
    hybrid: HybridNS,
    keys: KeysNS,
    session: SessionNS,
  }) as ConfiguredKMS;
}
