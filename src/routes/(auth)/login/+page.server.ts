import { redirect } from '@sveltejs/kit';
import { jwtService } from '$lib/server/utils/context';

export async function load({ cookies }) {
  const jwt = cookies.get('jwt');
  if (jwt)
    try {
      if (await jwtService.verify(jwt)) {
        throw redirect(303, '/dashboard');
      }
    } catch (e) {
      /* empty */
    }
}
