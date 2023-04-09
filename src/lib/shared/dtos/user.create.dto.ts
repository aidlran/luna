import { IsEmail, IsOptional, IsStrongPassword, Matches } from 'class-validator';
import { KeyPairCreateDTO } from './key-pair.create.dto';

export class UserCreateDTO extends KeyPairCreateDTO {
  @IsEmail(undefined, { message: 'Please enter a valid email.' })
  email: string;

  @IsStrongPassword(
    {
      minLength: 10,
      minLowercase: 2,
      minUppercase: 2,
      minNumbers: 0,
      minSymbols: 0,
    },
    {
      message:
        'This passphrase is not strong enough. Please use a combination of uppercase letters, lowercase letters, and numbers.',
    }
  )
  passphrase: string;

  @IsOptional()
  @Matches(/^[0-9A-Z]{4,24}$|^$/i, {
    message:
      'Usernames can only contain letters and numbers for now and must be between 4-24 characters long.',
  })
  username?: string;
}
