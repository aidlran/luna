import { redirect } from '@sveltejs/kit';

import { validateJWT } from '$lib/server';

export async function load({ cookies }) {
  if (await validateJWT(cookies)) {
    throw redirect(303, '/dashboard');
  }
}
