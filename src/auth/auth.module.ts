import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtSecret } from '../constants';
import { JwtStrategy } from './jwt.strategy';
import { MigrationsService } from 'src/sivep/migrations.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JwtSecret,
      signOptions: { expiresIn: '365d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MigrationsService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
