import { redirect } from '@sveltejs/kit';
import { userHasKey } from '$lib/server/model/keypair/keypair.repository';

export async function load({ parent }) {
  const { session } = await parent();

  // Redirect the user to onboard if they have no key pairs
  if (!(await userHasKey(session.user?.id))) {
    throw redirect(303, '/onboard');
  }
}
