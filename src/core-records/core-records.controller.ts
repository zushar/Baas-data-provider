import { Controller } from '@nestjs/common';
import { CoreRecordsService } from './core-records.service';
import { FilterCoreRecords } from '@/common/mongoose/schemas/core-records';
import { CoreRecordTypeName, RecordType } from '@/types/core-records';

@Controller('core-records')
export class CoreRecordsController {
  constructor(private readonly coreRecordsService: CoreRecordsService) {}

  // Add controller methods here
  // get all records paginated and filtered
  async getAllRecords({
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: FilterCoreRecords;
  }) {
    return this.coreRecordsService.getAllRecords({ page, limit, filter });
  }

  // get a single record by id
  async getRecordById(id: string) {
    return this.coreRecordsService.getRecordById(id);
  }

  // create a new record
  async createRecord(
    record: RecordType,
    recordType: CoreRecordTypeName,
    createdBy: string,
  ) {
    return this.coreRecordsService.createRecord(record, recordType, createdBy);
  }

  // update a record
  async updateRecord(id: string, record: RecordType, updatedBy: string) {
    return this.coreRecordsService.updateRecord(id, record, updatedBy);
  }
}
