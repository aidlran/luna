export class ApiError extends Error {
  friendlyMessage: string;
  constructor(method: 'POST', url: string, message: string) {
    super(message);
    this.friendlyMessage = `Request failed: ${message}.`;
    this.message = `${method} ${url} ${this.friendlyMessage}`;
  }
}
