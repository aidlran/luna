import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';
import * as JWT from 'jsonwebtoken';

import type { JwtUserData } from '../interfaces';

export const JWT_COOKIE_NAME = 'jwt';
export const JWT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function issueJWT(cookies: Cookies, user: JwtUserData) {
  cookies.set(
    JWT_COOKIE_NAME,
    JWT.sign({ user }, env.JWT_SECRET, {
      algorithm: 'HS512',
      issuer: 'projex',
      subject: user.name || user.email,
      expiresIn: '7d',
    }),
    {
      maxAge: JWT_COOKIE_MAX_AGE,
      httpOnly: true,
      path: '/',
      secure: env.NODE_ENV.trim().startsWith('prod'),
      sameSite: 'strict',
    }
  );
}

/**
 * Parses, validates, and returns the JWT session. Clears it if anything is amiss.
 */
export function validateJWT(cookies: Cookies) {
  const jwt = cookies.get(JWT_COOKIE_NAME);

  if (jwt) {
    try {
      return JWT.verify(jwt, env.JWT_SECRET) as JWT.JwtPayload;
    } catch (error) {
      /* fallthrough */
    }
  }

  deleteJWT(cookies);
  return null;
}

export function deleteJWT(cookies: Cookies) {
  cookies.delete(JWT_COOKIE_NAME);
}
