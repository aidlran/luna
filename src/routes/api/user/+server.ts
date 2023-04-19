import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { json, type RequestEvent } from '@sveltejs/kit';
import { ValidateFormData } from 'class-validator-svelte';

import { issueJWT, UserRepository } from '$lib/server';
import { UserCreateDTO } from '$lib/shared';

class UserController {
  @ValidateFormData(UserCreateDTO)
  async post({ cookies, request }: RequestEvent & { request: { dto: UserCreateDTO } }) {
    let user;

    try {
      user = await UserRepository.createOne(request.dto);
    } catch (error) {
      // Catch unique constraint failed
      // PlanetScale doesn't tell us which column :(
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        return json(
          {
            errors: {
              '': [`Sorry, that username or email address is already in use. Please try another one.`],
            },
          },
          { status: 403 }
        );
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
        return json(
          {
            errors: { '': ['Sorry, onboarding is not available right now. Please come back later.'] },
          },
          { status: 403 }
        );
      }
    }

    issueJWT(cookies, user);

    return json({ user }, { status: 201 });
  }
}

const userController = new UserController();

export const POST = userController.post;
