import { redirect } from '@sveltejs/kit';
import { verify } from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

export function load({ cookies }) {
  try {
    const jwt = cookies.get('jwt');
    if (!jwt) {
      throw 'and STAY OUT!';
    }
    verify(jwt, env.JWT_SECRET);
  } catch (error) {
    cookies.delete('jwt');
    throw redirect(307, '/login');
  }
}
