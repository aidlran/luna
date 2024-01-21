import { createSchema } from 'librebase/schema';

export const AccountSchema = createSchema<{
  name: string;
}>();
