import type { PrismaClient } from '@prisma/client';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import { ValidateFormData } from 'sveltekit-validator';
import { SessionCreateDTO, SessionDataUpdateDTO } from '$lib/shared/dtos';
import type { IUserMe } from '$lib/shared/interfaces';
import { type UserService, UserError } from '../../user';
import type { SessionService } from '../services/session.service';

// TODO: too much logic in here that should be in SessionService

export class SessionController {
  private readonly expireTime = 1000 * 60 * 60 * 24 * 7;

  constructor(
    /**
     * // TODO
     * @deprecated Move prismaClient calls to service(s).
     */
    private readonly prismaClient: PrismaClient,

    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  public async delete({ cookies }: RequestEvent): Promise<Response> {
    await this.sessionService.delete(cookies);
    return json({});
  }

  public async get({ cookies }: RequestEvent): Promise<Response> {
    const sessionContext = await this.sessionService.get(cookies);

    if (!sessionContext) {
      throw error(401);
    }

    if (!sessionContext.sessionID) {
      throw error(400, 'No session ID in token');
    }

    const sessionData = await this.prismaClient.session.delete({
      where: { id: sessionContext.sessionID },
    });

    // No session
    if (!sessionData) {
      throw error(404, 'No session data found for ID in token');
    }

    // Session too old
    if (sessionData.createdAt.getTime() + this.expireTime < Date.now()) {
      throw error(403, 'Session has expired');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sessionID, ...sanitisedSessionContext } = sessionContext;
    await this.sessionService.create(cookies, sanitisedSessionContext);

    const { payload } = sessionData;
    return json({ payload });
  }

  @ValidateFormData(SessionCreateDTO)
  public async post({
    cookies,
    request,
  }: RequestEvent & { request: { dto: SessionCreateDTO } }): Promise<Response> {
    const { identifier, passphrase } = request.dto;

    const user: IUserMe = await this.userService
      .findAndVerify(identifier, passphrase)
      .catch((e: unknown) => {
        if (e instanceof UserError) {
          switch (e.name) {
            case 'USER_NOT_FOUND':
              throw error(404, 'Account not found.');
            case 'INCORRECT_PASSPHRASE':
              throw error(403, 'Incorrect passphrase.');
          }
        }

        throw error(500, 'Having a bit of a moment, please come back later.');
        // TODO: return a message if the database provider is down and notify us
      });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { keyPairs, ...sessionContextUser } = user;

    await this.sessionService.create(cookies, { user: sessionContextUser });

    return json({ user }, { status: 201 });
  }

  @ValidateFormData(SessionDataUpdateDTO)
  public async put({
    cookies,
    request,
  }: RequestEvent & { request: { dto: SessionDataUpdateDTO } }): Promise<Response> {
    const sessionContext = await this.sessionService.get(cookies);

    if (!sessionContext) {
      throw error(401);
    }

    const { payload } = request.dto;

    const session = await this.prismaClient.session.create({
      data: {
        payload,
      },
      select: {
        id: true,
      },
    });

    sessionContext.sessionID = session.id;

    await this.sessionService.create(cookies, sessionContext);

    return json({});
  }
}
