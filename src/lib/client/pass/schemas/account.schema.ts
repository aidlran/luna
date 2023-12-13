import { createSchema } from 'trusync/schema';

export const AccountSchema = createSchema<{
  name: string;
}>();
