import { ValidateFormData } from 'class-validator-svelte';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import type { SessionService } from '$lib/server/session';
import { UserCreateDTO } from '$lib/shared/dtos';
import { UserError } from '../errors/user.error';
import type { UserService } from '../services/user.service';

export class UserController {
  constructor(
    //
    private sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  @ValidateFormData(UserCreateDTO)
  async post({ cookies, request }: RequestEvent & { request: { dto: UserCreateDTO } }) {
    try {
      const user = await this.userService.create(request.dto);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { keyPairs, ...sessionContextUser } = user;

      await this.sessionService.update(cookies, { user: sessionContextUser });

      return json({ user }, { status: 201 });
    } catch (e) {
      if (e instanceof UserError) {
        return json({ errors: { '': [e.message] } }, { status: 403 });
      }

      // eslint-disable-next-line no-console
      console.error(error);
      return json(
        {
          errors: { '': ['Sorry, onboarding is not available right now. Please come back later.'] },
        },
        { status: 500 },
      );
    }
  }
}
