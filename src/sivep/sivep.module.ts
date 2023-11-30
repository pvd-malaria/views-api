import { Module } from '@nestjs/common';

import { SivepController } from './sivep.controller';
import { SivepService } from './sivep.service';
import { MigrationsService } from './migrations.service';
import { ProfilerService } from 'src/profiler/profiler.service';

@Module({
  controllers: [SivepController],
  providers: [SivepService, MigrationsService, ProfilerService],
  exports: [SivepService, MigrationsService],
})
export class SivepModule {}
