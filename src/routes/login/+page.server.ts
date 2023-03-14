import { fail, redirect } from '@sveltejs/kit';
import { transformAndValidate } from 'class-transformer-validator';
import type { ValidationError } from 'class-validator';
import type { Actions } from './$types';
import { SessionCreateDTO } from '$lib/server/model/session/session.create.dto';

export const actions: Actions = {
  default: async function ({ request }) {
    const formData = await request.formData();

    const data: Record<string, unknown> = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      await transformAndValidate(SessionCreateDTO, data);
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

      throw error;
    }

    // TODO: Create session

    throw redirect(303, '/app');
  },
};
