import { Model } from 'mongoose';
import { AuditLog } from './schemas/audit-log.schema';
export declare class AuditLogsService {
    private readonly auditLogModel;
    constructor(auditLogModel: Model<AuditLog>);
    log(logData: {
        userId?: string;
        userEmail?: string;
        action: string;
        module: string;
        description?: string;
        previousData?: any;
        newData?: any;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<AuditLog>;
    findAll(options: any): Promise<any>;
}
