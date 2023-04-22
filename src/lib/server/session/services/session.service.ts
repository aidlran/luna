import type { Cookies } from '@sveltejs/kit';
import { NODE_ENV } from '$env/static/private';
import type { ISessionContext } from '../interfaces/session-context.interface';
import type { JwtService } from './jwt.service';
import type { PrismaClient } from '@prisma/client';

export class SessionService {
  private readonly cookieName = 'jwt';
  private readonly cookieConfig = {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    path: '/',
    secure: NODE_ENV?.trim().startsWith('prod'),
    sameSite: 'strict',
  } as const;

  constructor(
    //
    private readonly jwtService: JwtService,
    private readonly prismaClient: PrismaClient,
  ) {}

  public async create(cookies: Cookies, sessionContext: ISessionContext): Promise<void> {
    const jwt = await this.jwtService.issue(sessionContext);
    cookies.set(this.cookieName, jwt, this.cookieConfig);
  }

  public async delete(cookies: Cookies): Promise<void> {
    const jwt = cookies.get(this.cookieName);
    cookies.delete(this.cookieName, this.cookieConfig);

    // Delete stored session data asynchronously
    if (jwt)
      this.jwtService.verify(jwt).then((sessionContext) => {
        if (sessionContext.sessionID) {
          this.prismaClient.session.delete({ where: { id: sessionContext.sessionID } });
        }
      });
  }

  public async get(cookies: Cookies): Promise<ISessionContext | null> {
    const jwt = cookies.get(this.cookieName);

    if (jwt) {
      return await this.jwtService.verify(jwt);
    } else {
      return null;
    }
  }
}
