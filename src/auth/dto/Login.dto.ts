import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The username to log in as',
    example: 'admin',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The password to log in with',
    example: '12345',
  })
  @IsNotEmpty()
  password: string;
}
