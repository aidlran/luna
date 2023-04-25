import { error, json, type RequestEvent } from '@sveltejs/kit';
import { ValidateFormData } from 'class-validator-svelte';
import { EncryptedDataCreateDTO } from '$lib/shared/dtos';
import type { KeyPairService } from '../../key-pair';
import type { SessionService } from '../../session';
import type { EncryptedData, PrismaClient } from '@prisma/client';
import type { IModelIdResponse } from '$lib/shared/interfaces';

// TODO: move reusable logic to EncryptedDataService
export class EncryptedDataController {
  constructor(
    private readonly keyPairService: KeyPairService,
    private readonly prismaClient: PrismaClient,
    private readonly sessionService: SessionService,
  ) {}

  public async deleteOne(requestEvent: RequestEvent & { params: { id: string } }): Promise<Response> {
    await this.getOne(requestEvent);

    const { id } = requestEvent.params;
    await this.prismaClient.encryptedData.delete({ where: { id } });

    return json({});
  }

  public async getOne({ cookies, params }: RequestEvent & { params: { id: string } }): Promise<Response> {
    // Verify session
    const sessionContext = await this.sessionService.get(cookies);
    if (!sessionContext) {
      throw error(401);
    }

    const { id } = params;

    // Find the item, type check
    const response: EncryptedData = await this.prismaClient.encryptedData
      .findUniqueOrThrow({
        where: { id },
      })
      .catch(() => {
        throw error(404);
      });

    const { keyPairId } = response;
    const { id: userId } = sessionContext.user;

    // Verify User owns KeyPair
    await this.keyPairService.getUserKeyPair({ keyPairId, userId }).catch(() => {
      throw error(403);
    });

    return json(response);
  }

  public async getAllByUser({ cookies }: RequestEvent): Promise<Response> {
    // Verify session
    const sessionContext = await this.sessionService.get(cookies);
    if (!sessionContext) {
      throw error(401);
    }

    const { id: userId } = sessionContext.user;

    const keyPairIds: string[] = (await this.keyPairService.getUserKeyPairs(userId)).map(
      (userKeyPair) => userKeyPair.keyPairId,
    );

    // Find the items, type check
    const response: EncryptedData[] = await this.prismaClient.encryptedData.findMany({
      where: {
        keyPairId: {
          in: keyPairIds,
        },
      },
    });

    return json(response);
  }

  @ValidateFormData(EncryptedDataCreateDTO)
  public async post({
    cookies,
    request,
  }: RequestEvent & { request: { dto: EncryptedDataCreateDTO } }): Promise<Response> {
    // TODO: sign messages in client, check signature here

    // Verify session
    const sessionContext = await this.sessionService.get(cookies);
    if (!sessionContext) {
      throw error(401);
    }

    const { id: userId } = sessionContext.user;
    const { keyPairId, ...encryptedDataValues } = request.dto;

    // Check key owned by user
    try {
      await this.keyPairService.getUserKeyPair({
        userId,
        keyPairId,
      });
    } catch (e) {
      throw error(403);
    }

    // Create it and get the assigned ID
    const { id } = await this.prismaClient.encryptedData.create({
      data: {
        keyPair: { connect: { id: keyPairId } },
        ...encryptedDataValues,
      },
    });

    // Type checking our response
    const response: IModelIdResponse = { id };

    return json(response, { status: 201 });
  }
}
