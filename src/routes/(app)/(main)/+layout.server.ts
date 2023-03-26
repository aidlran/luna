import { redirect } from '@sveltejs/kit';
import { userHasKey } from '$lib/server/model/keypair';
import { deleteJWT } from '$lib/server/services';

export async function load({ cookies, parent }) {
  const { session } = await parent();

  if (!(await userHasKey(session.payload?.user?.id))) {
    deleteJWT(cookies);
    throw redirect(303, '/login?no_keys');
  }
}
