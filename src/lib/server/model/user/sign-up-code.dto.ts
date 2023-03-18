import { Equals } from 'class-validator';
import { env } from '$env/dynamic/private';

export class SignUpCodeDTO {
  @Equals(env.SIGN_UP_CODE, { message: 'Invalid sign up code.' })
  signUpCode: string;
}
