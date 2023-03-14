import { fail, redirect } from '@sveltejs/kit';
import { transformAndValidate } from 'class-transformer-validator';
import type { ValidationError } from 'class-validator';
import type { Actions } from './$types';
import { UserCreateDTO } from '$lib/server/model/user/user.create.dto';

export const actions: Actions = {
  default: async function ({ request }) {
    const formData = await request.formData();

    const data: Record<string, unknown> = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      await transformAndValidate(UserCreateDTO, data);
    } catch (error) {
      if (error instanceof Array<ValidationError>) {
        const returnedErrors: Record<string, string[]> = {};
        error.forEach((validationError: ValidationError) => {
          if (validationError.constraints) {
            returnedErrors[validationError.property] = Object.values(validationError.constraints);
          }
        });
        return fail(400, { errors: returnedErrors });
      }

      console.log(error);
      return fail(500, { errors: { '': ['Something went wrong. Please try again later.'] } });
    }

    // // TODO: Create session
    // throw redirect(303, '/app');

    return fail(403, { errors: { '': ['Sorry, onboarding is not available right now.'] } });
  },
};
