import type { Cookies } from '@sveltejs/kit';
import { NODE_ENV } from '$env/static/private';
import type { ISessionContext } from '../interfaces/session-context.interface';
import type { JwtService } from './jwt.service';

export class SessionService {
  private readonly cookieName = 'jwt';
  private readonly cookieConfig = {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    path: '/',
    secure: NODE_ENV?.trim().startsWith('prod'),
    sameSite: 'strict',
  } as const;

  constructor(private readonly jwtService: JwtService) {}

  public async update(cookies: Cookies, sessionContext: ISessionContext) {
    const jwt = await this.jwtService.issue(sessionContext);
    cookies.set(this.cookieName, jwt, this.cookieConfig);
  }
}
