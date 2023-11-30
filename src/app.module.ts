import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SivepModule } from './sivep/sivep.module';

@Module({
  imports: [AuthModule, SivepModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
