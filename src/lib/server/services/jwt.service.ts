import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';
import { jwtVerify, SignJWT, type JWTVerifyResult } from 'jose';

import type { JwtUserData } from '../interfaces';

export const JWT_COOKIE_NAME = 'jwt';
export const JWT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function issueJWT(cookies: Cookies, user: JwtUserData) {
  cookies.set(
    JWT_COOKIE_NAME,
    await new SignJWT({ user })
      .setProtectedHeader({ alg: 'HS512' })
      .setIssuedAt()
      .setIssuer('projex')
      .setSubject(user.name || user.email)
      .setExpirationTime('7d')
      .sign(JWT_SECRET),
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
export async function validateJWT(cookies: Cookies) {
  const jwt = cookies.get(JWT_COOKIE_NAME);

  if (jwt)
    try {
      return (await jwtVerify(jwt, JWT_SECRET, {
        issuer: 'projex',
      })) as JWTVerifyResult & { user: JwtUserData };
    } catch (error) {
      /* fallthrough */
    }

  deleteJWT(cookies);
  return null;
}

export function deleteJWT(cookies: Cookies) {
  cookies.delete(JWT_COOKIE_NAME);
}
