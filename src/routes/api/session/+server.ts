import { error, json, type RequestEvent } from '@sveltejs/kit';
import { ValidateFormData } from 'class-validator-svelte';

import { issueJWT, UserRepository } from '$lib/server';
import { SessionCreateDTO } from '$lib/shared';

class SessionController {
  @ValidateFormData(SessionCreateDTO)
  async post({ cookies, request }: RequestEvent & { request: { dto: SessionCreateDTO } }) {
    let user;

    try {
      user = await UserRepository.findOneAndVerify(request.dto);
    } catch (findUserError) {
      if (findUserError === UserRepository.INCORRECT_PASSPHRASE) {
        throw error(403, 'Incorrect passphrase.');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((findUserError as any).code === 'P2025') {
        throw error(404, 'Account not found.');
      }

      console.error(findUserError);
      throw error(500, 'Having a bit of a moment, please come back later.');

      // TODO: return a message if the database provider is down and notify us
    }

    await issueJWT(cookies, user);

    return json({ user }, { status: 201 });
  }
}

const sessionController = new SessionController();

export const POST = sessionController.post;
