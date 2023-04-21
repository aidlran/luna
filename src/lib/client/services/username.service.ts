export class UsernameService {
  /**
   * Generates a username from the name part of an email address.
   * @param {string} email An email address.
   * @returns {string} A username string
   *
   * @TODO check if username exists & append a random number.
   */
  public generateFromEmail(email: string): string {
    return this.sanitise(email.split('@')[0].split('+')[0]).slice(0, 24);
  }

  /**
   * Sanitises a username, leaving only alphanumeric characters.
   * @param {string} username A username string.
   * @returns {string} A sanitised username string.
   */
  public sanitise(username: string): string {
    return username.replace(/[^0-9a-zA-Z]/gi, '');
  }
}
