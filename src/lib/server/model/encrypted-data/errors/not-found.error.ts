export class NotFoundError extends Error {
  constructor() {
    super('Not found.');
    delete this.stack;
  }
}
