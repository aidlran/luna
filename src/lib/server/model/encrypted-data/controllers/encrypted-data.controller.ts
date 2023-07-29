import { error, json, type Cookies, type RequestEvent } from '@sveltejs/kit';
import { ValidateFormData } from 'sveltekit-validator';
import { EncryptedDataCreateDTO } from '$lib/shared/dtos';
import type { IModelIdResponse, EncryptedDataWithKeysResponse } from '$lib/shared/interfaces';
import type { SessionService } from '../../session';
import { NotFoundError } from '../errors/not-found.error';
import { PermissionDeniedError } from '../errors/permission-denied.error';
import type { EncryptedDataService } from '../services/encrypted-data.service';

// TODO: move reusable logic to EncryptedDataService

export class EncryptedDataController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly encryptedDataService: EncryptedDataService,
  ) {}

  private async getUserID(cookies: Cookies): Promise<string> {
    // TODO: session verify/get context decorator
    const sessionContext = await this.sessionService.get(cookies);

    if (!sessionContext) {
      throw error(401);
    }

    return sessionContext.user.id;
  }

  private getError(e: unknown): unknown {
    return e instanceof NotFoundError ? error(404) : e instanceof PermissionDeniedError ? error(403) : e;
  }

  public async deleteByIdAndUser({
    cookies,
    params,
  }: RequestEvent & { params: { id: string } }): Promise<Response> {
    const encryptedDataID = params.id;
    const userID = await this.getUserID(cookies);

    await this.encryptedDataService.deleteByIdAndUser(encryptedDataID, userID).catch((e) => {
      throw this.getError(e);
    });

    return json({});
  }

  public async getByIdIncludeKeysForUser({
    cookies,
    params,
  }: RequestEvent & { params: { id: string } }): Promise<Response> {
    const encryptedDataID = params.id;
    const userID = await this.getUserID(cookies);

    // Get typed response, catch errors
    const response: EncryptedDataWithKeysResponse = await this.encryptedDataService
      .getByIdIncludeKeysForUser(encryptedDataID, userID)
      .catch((e) => {
        throw this.getError(e);
      });

    return json(response);
  }

  public async getByUserIncludeKeys({ cookies }: RequestEvent): Promise<Response> {
    // Find the items, type check
    const response: EncryptedDataWithKeysResponse[] = await this.encryptedDataService.getByUserIncludeKeys(
      await this.getUserID(cookies),
    );

    return json(response);
  }

  @ValidateFormData(EncryptedDataCreateDTO)
  public async createForUser({
    cookies,
    request,
  }: RequestEvent & { request: { dto: EncryptedDataCreateDTO } }): Promise<Response> {
    // TODO: sign messages in client, check signature here

    const userID = await this.getUserID(cookies);
    const DTO = request.dto;

    const { encryptedDataID } = await this.encryptedDataService.createForUser(userID, DTO);

    // Type checking our response
    const response: IModelIdResponse = { id: encryptedDataID };

    return json(response, { status: 201 });
  }

  async getRootData({ cookies, params }: RequestEvent & { params: { id: string } }) {
    const userID = await this.getUserID(cookies);

    let appID: number;

    try {
      appID = Number(params.id);
    } catch (e) {
      throw error(400, 'Invalid app ID');
    }

    try {
      const rootData = await this.encryptedDataService.getRootData(appID, userID);
      return json(rootData);
    } catch (e) {
      throw this.getError(e);
    }
  }

  @ValidateFormData(EncryptedDataCreateDTO)
  async updateRootData({
    cookies,
    params,
    request,
  }: RequestEvent & { request: { dto: EncryptedDataCreateDTO }; params: { id: string } }) {
    const userID = await this.getUserID(cookies);
    const DTO = request.dto;

    let appID: number;

    try {
      appID = Number(params.id);
    } catch (e) {
      throw error(400, 'Invalid app ID');
    }

    try {
      const rootData = await this.encryptedDataService.upsertRootData(appID, userID, DTO);
      return json(rootData);
    } catch (e) {
      throw this.getError(e);
    }
  }
}
