import type { IApiMaybeErrorResponse } from '../interfaces/api-error-response';
import { ApiError } from '../errors/api.error';

export abstract class ApiService {
  private readonly controllerURL;

  constructor(controllerURL: string) {
    this.controllerURL = `/api/${controllerURL}`;
  }

  protected async post<D extends object, T>(routeURL: string, data: D): Promise<T & IApiMaybeErrorResponse> {
    const body = new FormData();

    for (const [name, value] of Object.entries(data)) {
      body.set(name, value);
    }

    routeURL = `${this.controllerURL}/${routeURL}`;

    const response = await fetch(routeURL, { body, method: 'POST' }).catch(() => {
      throw new ApiError('POST', routeURL, 'server could not be reached');
    });

    return await response.json().catch(() => {
      throw new ApiError('POST', routeURL, 'could not parse server response');
    });
  }
}
