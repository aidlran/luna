import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import { sessionController } from '$lib/server/model/session';
import { validateJWT } from '$lib/server/services';

export async function load({ cookies }) {
  if (await validateJWT(cookies)) {
    throw redirect(303, '/dashboard');
  }
}

export const actions: Actions = {
  default: sessionController.post,
};
