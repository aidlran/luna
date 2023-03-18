import type { Actions } from './$types';

import { userController } from '$lib/server/model/user';
import { env } from '$env/dynamic/private';
import { fail, type Cookies } from '@sveltejs/kit';

export const actions: Actions = {
  signUp: (requestEvent) =>
    hasValidSignUpCode(requestEvent.cookies)
      ? userController.signUp(requestEvent)
      : fail(403, { errors: { signUpCode: ['Invalid sign up code. Please refresh.'] } }),
  submitCode: userController.submitCode,
};

export function load(requestEvent) {
  return {
    signUpCodeValid: hasValidSignUpCode(requestEvent.cookies),
  };
}

function hasValidSignUpCode(cookies: Cookies) {
  const isCodeValid = cookies.get('sign_up_code') === env.SIGN_UP_CODE;
  if (!isCodeValid) cookies.delete('sign_up_code');
  return isCodeValid;
}
