import { deleteJWT } from '$lib/server/services';

export function DELETE({ cookies }) {
  deleteJWT(cookies);
  return new Response();
}
