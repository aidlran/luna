import { randomBytes } from 'crypto';

export const passphrase = randomBytes(8).toString('base64');
