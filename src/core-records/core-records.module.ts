import { Module } from '@nestjs/common';
import { CoreRecordsService } from './core-records.service';
import { CoreRecordsController } from './core-records.controller';

@Module({
  providers: [CoreRecordsService],
  controllers: [CoreRecordsController],
})
export class CoreRecordsModule {}
