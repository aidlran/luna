import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import { KeyPairRepository, validateJWT } from '$lib/server';

const COOKIE_NAME = 'sign_up_code';

export async function load({ cookies }) {
  const session = await validateJWT(cookies);

  if (session && (await KeyPairRepository.userHasKey(session.payload?.user?.id))) {
    throw redirect(303, '/dashboard');
  }

  const signUpCode = cookies.get(COOKIE_NAME);
  if (signUpCode !== env.SIGN_UP_CODE) {
    cookies.delete(COOKIE_NAME);
    throw redirect(303, '/signup/code' + (signUpCode ? '?invalid' : ''));
  }
}
