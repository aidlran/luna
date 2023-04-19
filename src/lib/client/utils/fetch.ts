/* eslint-disable no-console */

export type ApiPostUrl = 'session' | 'user';

const apiPrefix = '/api/';

export class FetchError extends Error {
  friendlyMessage: string;
  constructor(method: 'POST', url: ApiPostUrl, message: string, options?: ErrorOptions | undefined) {
    super(message, options);
    this.friendlyMessage = `Request failed: ${message}.`;
    this.message = `${method} ${apiPrefix}${url} ${this.friendlyMessage}`;
  }
}

export async function post<T extends object>(url: ApiPostUrl, data: T): Promise<unknown> {
  const body = new FormData();

  for (const [name, value] of Object.entries(data)) {
    body.set(name, value);
  }

  let response: Response;

  try {
    response = await fetch(apiPrefix + url, {
      body,
      method: 'POST',
    });
  } catch (error) {
    console.error(error);
    throw new FetchError('POST', url, 'server could not be reached');
  }

  try {
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new FetchError('POST', url, 'could not parse server response');
  }
}
