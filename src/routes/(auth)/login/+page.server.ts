import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import { sessionController } from '$lib/server/model/session';
import { validateJWT } from '$lib/server/services';

export function load({ cookies }) {
  if (validateJWT(cookies)) {
    throw redirect(303, '/app');
  }
}

export const actions: Actions = {
  default: sessionController.post,
};
