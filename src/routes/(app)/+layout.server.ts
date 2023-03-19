import { redirect } from '@sveltejs/kit';
import { validateJWT } from '$lib/server/services';

export async function load({ cookies }) {
  const session = await validateJWT(cookies);

  if (session) {
    return { session };
  } else {
    throw redirect(303, '/login');
  }
}
