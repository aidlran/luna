import type { Actions } from './$types';

import { userController } from '$lib/server/model/user';
import { env } from '$env/dynamic/private';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import { validateJWT } from '$lib/server/services';

export function load({ cookies }) {
  if (validateJWT(cookies)) {
    throw redirect(303, '/app');
  }
  return {
    signUpCodeValid: hasValidSignUpCode(cookies),
  };
}

export const actions: Actions = {
  signUp: (requestEvent) =>
    hasValidSignUpCode(requestEvent.cookies)
      ? userController.signUp(requestEvent)
      : fail(403, { errors: { signUpCode: ['Invalid sign up code. Please refresh.'] } }),
  submitCode: userController.submitCode,
};

function hasValidSignUpCode(cookies: Cookies) {
  const isCodeValid = cookies.get('sign_up_code') === env.SIGN_UP_CODE;
  if (!isCodeValid) cookies.delete('sign_up_code');
  return isCodeValid;
}
