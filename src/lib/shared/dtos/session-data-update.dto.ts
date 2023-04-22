import { IsString } from 'class-validator';
import type { ISessionDataUpdate } from '../interfaces/session-data-update.interface';

export class SessionDataUpdateDTO implements ISessionDataUpdate {
  @IsString()
  payload: string;
}
