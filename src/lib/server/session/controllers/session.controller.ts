import { error, json, type RequestEvent } from '@sveltejs/kit';
import { ValidateFormData } from 'class-validator-svelte';
import { SessionCreateDTO } from '$lib/shared/dtos';
import type { IUserMe, UserService } from '$lib/server/user';
import type { SessionService } from '../services/session.service';
import { UserError } from '$lib/server/user/errors/user.error';

export class SessionController {
  constructor(
    //
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  public delete() {
    // TODO
  }

  public get() {
    // TODO
  }

  @ValidateFormData(SessionCreateDTO)
  public async post({
    cookies,
    request,
  }: RequestEvent & { request: { dto: SessionCreateDTO } }): Promise<Response> {
    const { identifier, passphrase } = request.dto;

    const user: IUserMe = await this.userService.findAndVerify(identifier, passphrase).catch((e: unknown) => {
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

    await this.sessionService.update(cookies, { user: sessionContextUser });

    return json({ user }, { status: 201 });
  }
}
