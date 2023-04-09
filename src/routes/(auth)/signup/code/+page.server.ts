import { fail, redirect, type Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions } from './$types';

const COOKIE_NAME = 'sign_up_code';

export async function load({ cookies }) {
  checkCode(cookies);
}

export const actions: Actions = {
  default: async function ({ cookies, request }) {
    checkCode(cookies, (await request.formData()).get('signUpCode')?.toString());
    return fail(403, { error: 'Invalid sign up code.' });
  },
};

function checkCode(cookies: Cookies, code?: string) {
  code = code ?? cookies.get(COOKIE_NAME);
  if (code === env.SIGN_UP_CODE) {
    cookies.set(COOKIE_NAME, code, { sameSite: 'strict' });
    throw redirect(303, '/signup');
  } else {
    cookies.delete(COOKIE_NAME);
  }
}
