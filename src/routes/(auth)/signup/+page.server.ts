import { redirect, type Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions } from './$types';

import { validateJWT } from '$lib/server/services';
import { userController } from '$lib/server/model/user';
import { userHasKey } from '$lib/server/model/keypair';

export async function load({ cookies }) {
  const session = await validateJWT(cookies);

  if (session && (await userHasKey(session.payload?.user?.id))) {
    throw redirect(303, '/dashboard');
  }

  return { session, signUpCodeValid: hasValidSignUpCode(cookies) };
}

export const actions: Actions = {
  createUser: (requestEvent) => {
    if (hasValidSignUpCode(requestEvent.cookies)) {
      return userController.signUp(requestEvent);
    } else {
      throw redirect(303, '/signup?invalid_code');
    }
  },
  submitCode: userController.submitCode,
};

function hasValidSignUpCode(cookies: Cookies) {
  const isCodeValid = cookies.get('sign_up_code') === env.SIGN_UP_CODE;
  if (!isCodeValid) cookies.delete('sign_up_code');
  return isCodeValid;
}
