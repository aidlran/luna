import { ValidateDTO } from '$lib/shared/services/form-validation.service';
import { fail } from '@sveltejs/kit';

import { SessionCreateDTO } from './session.create.dto';

class SessionController {
  @ValidateDTO(SessionCreateDTO)
  async post() {
    // // TODO: Create session
    // throw redirect(303, '/app');

    return fail(403, { errors: { '': ['Incorrect login details.'] } });
  }
}

export const sessionController = new SessionController();
export default sessionController;
