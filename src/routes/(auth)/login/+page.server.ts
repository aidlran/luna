import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import { validateJWT } from '$lib/server';

export async function load({ cookies }) {
  if (await validateJWT(cookies)) {
    throw redirect(303, '/dashboard');
  }
}

export const actions: Actions = {
  default: function () {
    return fail(400, { error: 'Please enable JavaScript in your browser.' });
  },
};
