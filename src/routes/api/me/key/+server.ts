import { error, json } from '@sveltejs/kit';
import { validateFormData } from 'class-validator-svelte';
import { validateJWT } from '$lib/server/services';
import { createUserKeyPair, KeyPairCreateDTO } from '$lib/server/model/keypair';

export async function POST({ cookies, request }) {
  const session = await validateJWT(cookies);
  if (!session) throw error(403);

  const formData = await validateFormData(await request.formData(), KeyPairCreateDTO);
  if (!formData.ok) throw error(400);

  return json(await createUserKeyPair(session.payload?.user?.id, formData.dto));
}
