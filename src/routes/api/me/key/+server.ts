import { error, json } from '@sveltejs/kit';
import { validateFormData } from 'class-validator-svelte';

import { KeyPairRepository } from '$lib/server/model';
import { KeyPairCreateDTO } from '$lib/shared/dtos';
import { jwtService } from '$lib/server/utils/context';

export async function POST({ cookies, request }) {
  let sessionContext;

  const jwt = cookies.get('jwt');
  if (jwt) {
    try {
      sessionContext = await jwtService.verify(jwt);
    } catch (e) {
      throw error(403);
    }
    if (!sessionContext) throw error(403);
  } else {
    throw error(403);
  }

  const formData = await validateFormData(await request.formData(), KeyPairCreateDTO);
  if (!formData.ok) throw error(400);

  return json(await KeyPairRepository.createUserKeyPair(sessionContext.user.id, formData.dto));
}
