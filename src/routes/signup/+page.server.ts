import type { Actions } from './$types';

import { userController } from '$lib/server/feature/user';

export const actions: Actions = {
  default: userController.post,
};
