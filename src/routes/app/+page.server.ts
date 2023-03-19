import { redirect } from '@sveltejs/kit';
import { validateJWT } from '$lib/server/services';

export function load({ cookies }) {
  if (!validateJWT(cookies)) {
    throw redirect(307, '/login');
  }
}
