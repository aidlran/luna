import type { IApiMaybeErrorResponse } from '../interfaces/api-error-response';
import { ApiError } from '../errors/api.error';

export abstract class ApiService {
  private readonly controllerURL;

  constructor(controllerURL: string) {
    this.controllerURL = `/api/${controllerURL}`;
  }

  private async fetch<T extends object>(
    routeURL: string,
    fetchInit: RequestInit & { method: string },
  ): Promise<T & IApiMaybeErrorResponse> {
    const url = routeURL ? `${this.controllerURL}/${routeURL}` : this.controllerURL;

    const response = await fetch(url, fetchInit).catch(() => {
      throw new ApiError(fetchInit.method, url, 'server could not be reached');
    });

    return await response.json().catch(() => {
      throw new ApiError(fetchInit.method, url, 'could not parse server response');
    });
  }

  private async fetchWithBody<D extends object, T extends object>(
    routeURL = '',
    method: string,
    data: D,
  ): Promise<T & IApiMaybeErrorResponse> {
    const body = new FormData();

    for (const [name, value] of Object.entries(data)) {
      body.set(name, value);
    }

    return this.fetch<T>(routeURL, { body, method });
  }

  /**
   * Performs a `DELETE` request.
   * @param {string} [routeURL] The route URL string.
   * @returns {Promise<T & IApiMaybeErrorResponse>}
   */
  protected DELETE<T extends object>(routeURL = ''): Promise<T & IApiMaybeErrorResponse> {
    return this.fetch<T>(routeURL, { method: 'DELETE' });
  }

  /**
   * Performs a `GET` request.
   * @param {string} [routeURL] The route URL string.
   * @returns {Promise<T & IApiMaybeErrorResponse>}
   */
  protected GET<T extends object>(routeURL = ''): Promise<T & IApiMaybeErrorResponse> {
    return this.fetch<T>(routeURL, { method: 'GET' });
  }

  /**
   * Performs a `POST` request.
   * @param {string} [routeURL] The route URL string.
   * @param {D} data An object to submit in the request body.
   * @returns {Promise<T & IApiMaybeErrorResponse>}
   */
  protected async POST<D extends object, T extends object>(
    routeURL = '',
    data: D,
  ): Promise<T & IApiMaybeErrorResponse> {
    return this.fetchWithBody(routeURL, 'POST', data);
  }

  /**
   * Performs a `PUT` request.
   * @param {string} [routeURL] The route URL string.
   * @param {D} data An object to submit in the request body.
   * @returns {Promise<T & IApiMaybeErrorResponse>}
   */
  protected async PUT<D extends object, T extends object>(
    routeURL = '',
    data: D,
  ): Promise<T & IApiMaybeErrorResponse> {
    return this.fetchWithBody(routeURL, 'PUT', data);
  }
}
