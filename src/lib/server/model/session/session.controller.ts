import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { ValidateFormData } from 'class-validator-svelte';

import { issueJWT } from '$lib/server/services';
import { findOneAndVerify, INCORRECT_PASSPHRASE } from '../user/user.repository';
import { SessionCreateDTO } from './session.create.dto';

class SessionController {
  @ValidateFormData(SessionCreateDTO)
  async post(event: RequestEvent & { request: { dto: SessionCreateDTO } }) {
    let user;

    try {
      user = await findOneAndVerify(event.request.dto);
    } catch (error) {
      if (error === INCORRECT_PASSPHRASE) {
        return fail(403, { errors: { passphrase: ['Incorrect passphrase.'] } });
      } else if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return fail(404, { errors: { identifier: ['Account not found.'] } });
      } else {
        console.error(error);
        return fail(500, { errors: { '': ['I am having a bit of a moment. Please come back later.'] } });
      }
      // TODO: return a message if the database provider is down and notify us
    }

    await issueJWT(event.cookies, user);

    throw redirect(303, '/dashboard');
  }
}

export const sessionController = new SessionController();
export default sessionController;
