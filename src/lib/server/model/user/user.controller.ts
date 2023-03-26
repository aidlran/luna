import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { ValidateFormData } from 'class-validator-svelte';

import { issueJWT } from '$lib/server/services';
import * as UserRepository from './user.repository';
import { UserCreateDTO } from './user.create.dto';
import { SignUpCodeDTO } from './sign-up-code.dto';

class UserController {
  @ValidateFormData(UserCreateDTO)
  async signUp(event: RequestEvent & { request: { dto: UserCreateDTO } }) {
    let user;

    try {
      user = await UserRepository.createOne(event.request.dto);
    } catch (error) {
      // Catch unique constraint failed
      // PlanetScale doesn't tell us which column :(
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        return fail(403, {
          errors: {
            '': [`Sorry, that username or email address is already in use. Please try another one.`],
          },
        });
      } else {
        console.error(error);
        return fail(403, {
          errors: { '': ['Sorry, onboarding is not available right now. Please come back later.'] },
        });
      }
    }

    issueJWT(event.cookies, user);

    return { user };
  }

  @ValidateFormData(SignUpCodeDTO)
  async submitCode(event: RequestEvent & { request: { dto: SignUpCodeDTO } }) {
    event.cookies.set('sign_up_code', event.request.dto.signUpCode, { sameSite: 'strict' });
  }
}

export const userController = new UserController();
export default userController;
