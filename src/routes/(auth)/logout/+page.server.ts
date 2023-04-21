import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
  cookies.delete('jwt');
  throw redirect(303, '/login');
}
