import { ValidateDTO } from '$lib/shared';
import { fail } from '@sveltejs/kit';

import { UserCreateDTO } from './user.create.dto';

class UserController {
  @ValidateDTO(UserCreateDTO)
  async post() {
    // // TODO: Create session
    // throw redirect(303, '/app');

    return fail(403, { errors: { '': ['Sorry, onboarding is not available right now.'] } });
  }
}

export const userController = new UserController();
export default userController;
