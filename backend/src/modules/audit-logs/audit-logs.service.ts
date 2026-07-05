import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './schemas/audit-log.schema';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLog>,
  ) {}

  async log(logData: {
    userId?: string;
    userEmail?: string;
    action: string;
    module: string;
    description?: string;
    previousData?: any;
    newData?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const createdLog = new this.auditLogModel(logData);
    return createdLog.save();
  }

  async findAll(options: any): Promise<any> {
    return (this.auditLogModel as any).paginate(options);
  }
}
