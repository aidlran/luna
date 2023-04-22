import { SignJWT, jwtVerify, type JWTVerifyResult } from 'jose';
import { JWT_SECRET } from '$env/static/private';
import type { ISessionContext } from '../interfaces/session-context.interface';

/** A service that issues and validates JSON web tokens. */
export class JwtService {
  /** JWT secret for signing. */
  private readonly secret = new TextEncoder().encode(JWT_SECRET);
  private readonly issuer = 'projex';

  /**
   * Issues a new JSON web token.
   * @param {ISessionContext} context Session context to embed in the token.
   * @returns {Promise<string>} A promise that resolves with the encoded JSON web token string.
   */
  public async issue(context: ISessionContext): Promise<string> {
    return await new SignJWT({ context })
      .setProtectedHeader({ alg: 'HS512' })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setSubject(context.user.name || context.user.email)
      .setExpirationTime('7d')
      .sign(this.secret);
  }

  /**
   * Validates a JSON web token. Throws an error if validation fails.
   * @param jwt An encoded JSON web token string.
   * @returns {Promise<ISessionContext>} A promise that resolves with the session context embedded in the token.
   */
  public async verify(jwt: string): Promise<ISessionContext> {
    const verifyResult = (await jwtVerify(jwt, this.secret, {
      issuer: this.issuer,
    })) as JWTVerifyResult & { payload: { context: ISessionContext } };

    return verifyResult.payload.context;
  }
}
