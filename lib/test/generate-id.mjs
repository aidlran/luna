import { randomBytes } from 'crypto';

export const generateID = () => randomBytes(8).toString('base64');
