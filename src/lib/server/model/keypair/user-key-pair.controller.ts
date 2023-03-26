import { fail, type RequestEvent } from '@sveltejs/kit';
import { ValidateFormData } from 'class-validator-svelte';

import { validateJWT } from '$lib/server/services';
import { KeyPairCreateDTO } from './key-pair.create.dto';
import { createUserKeyPair } from './key-pair.repository';

class UserKeyPairController {
  @ValidateFormData(KeyPairCreateDTO)
  async create({ cookies, request }: RequestEvent & { request: { dto: KeyPairCreateDTO } }) {
    const session = await validateJWT(cookies);

    if (!session) return fail(403);

    return createUserKeyPair(session.payload?.user?.id, request.dto);
  }
}

export const userKeyPairController = new UserKeyPairController();
export default userKeyPairController;
