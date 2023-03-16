import { fail } from '@sveltejs/kit';
import { ValidateFormData } from 'class-validator-svelte';

import { UserCreateDTO } from './user.create.dto';

class UserController {
  @ValidateFormData(UserCreateDTO)
  post() {
    // // TODO: Create session
    // throw redirect(303, '/app');

    return fail(403, { errors: { '': ['Sorry, onboarding is not available right now.'] } });
  }
}

export const userController = new UserController();
export default userController;
