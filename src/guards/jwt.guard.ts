import { Injectable, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}

export const Jwt = () => {
  return applyDecorators(UseGuards(JwtGuard), ApiBearerAuth());
};
