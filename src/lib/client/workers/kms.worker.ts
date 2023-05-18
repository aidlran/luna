import { Worker } from '@enclavetech/kms-core';
import { PGPLibImpl } from '@enclavetech/kms-openpgp';

new Worker(new PGPLibImpl());
