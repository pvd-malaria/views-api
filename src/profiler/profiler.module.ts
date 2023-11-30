import { Module } from '@nestjs/common';

import { ProfilerService } from './profiler.service';

@Module({
  controllers: [],
  providers: [ProfilerService],
  exports: [ProfilerService],
})
export class ProfilerModule {}
