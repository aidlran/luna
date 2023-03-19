import { redirect } from '@sveltejs/kit';
import { validateJWT } from '$lib/server/services';

export function load({ cookies }) {
  const session = validateJWT(cookies);

  if (session) {
    return { session };
  } else {
    throw redirect(303, '/login');
  }
}
