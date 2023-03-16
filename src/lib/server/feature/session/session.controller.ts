import { fail } from '@sveltejs/kit';
import { ValidateFormData } from 'class-validator-svelte';

import { SessionCreateDTO } from './session.create.dto';

class SessionController {
  @ValidateFormData(SessionCreateDTO)
  post() {
    // // TODO: Create session
    // throw redirect(303, '/app');

    return fail(403, { errors: { '': ['Incorrect login details.'] } });
  }
}

export const sessionController = new SessionController();
export default sessionController;
