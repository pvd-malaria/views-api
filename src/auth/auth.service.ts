import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { MigrationsService } from 'src/sivep/migrations.service';

import { LoginDto } from './dto';

import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly migrations: MigrationsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const q = await this.migrations.client.query(`
      SELECT * FROM "Users"
      WHERE "username" = '${loginDto.username}';
    `);

    if (!q || !q.rows || !q.rows.length) {
      throw new NotFoundException('No such user');
    }

    const user = q.rows[0];

    const valid = await argon2.verify(
      user.password,
      loginDto.password + user.passwordSalt,
    );
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: loginDto.username,
      iat: Date.now() / 1000,
      iatMs: Date.now(),
    };

    return this.jwtService.sign(payload);
  }

  async checkToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verify(token);
    } catch (_) {
      return false;
    }
    return true;
  }
}
