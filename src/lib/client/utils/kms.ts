import { KMS, HybridNS, KeysNS, SessionNS } from '@enclavetech/kms-core';
import Worker from '$lib/client/workers/kms.worker?worker';

export type ConfiguredKMS = KMS & {
  hybrid: HybridNS;
  keys: KeysNS;
  session: SessionNS;
};

export function createConfiguredKMS() {
  return new KMS(() => new Worker(), {
    clusterSize: 2,
    hybrid: HybridNS,
    keys: KeysNS,
    session: SessionNS,
  }) as ConfiguredKMS;
}
