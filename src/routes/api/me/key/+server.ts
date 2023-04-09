import { error, json } from '@sveltejs/kit';
import { validateFormData } from 'class-validator-svelte';

import { validateJWT, KeyPairRepository } from '$lib/server';
import { KeyPairCreateDTO } from '$lib/shared';

export async function POST({ cookies, request }) {
  const session = await validateJWT(cookies);
  if (!session) throw error(403);

  const formData = await validateFormData(await request.formData(), KeyPairCreateDTO);
  if (!formData.ok) throw error(400);

  return json(await KeyPairRepository.createUserKeyPair(session.payload?.user?.id, formData.dto));
}
POST;
