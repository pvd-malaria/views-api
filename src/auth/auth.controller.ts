import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

import { LoginDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login (returns a JWT token)',
  })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<string> {
    return this.authService.login(loginDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Check if token is valid',
  })
  async checkToken(@Req() req: Request) {
    const jwt = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const isValid = await this.authService.checkToken(jwt);
    return { valid: isValid };
  }
}
