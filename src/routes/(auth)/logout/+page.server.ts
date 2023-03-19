import { redirect } from '@sveltejs/kit';
import { deleteJWT } from '$lib/server/services';

export function load({ cookies }) {
  deleteJWT(cookies);
  throw redirect(303, '/login');
}
