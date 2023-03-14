import { IsNotEmpty, IsString } from 'class-validator';

export class SessionCreateDTO {
  @IsString({ message: 'Please enter a valid username or email address.' })
  @IsNotEmpty({ message: 'Please enter a username or email address.' })
  identifier: string;

  @IsString({ message: 'Please enter your passphrase.' })
  @IsNotEmpty({ message: 'Please enter your passphrase.' })
  passphrase: string;
}
