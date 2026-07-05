import { Model } from 'mongoose';
import { Permission } from './schemas/permission.schema';
export declare class PermissionsService {
    private readonly permissionModel;
    constructor(permissionModel: Model<Permission>);
    create(createDto: any): Promise<Permission>;
    findAll(): Promise<Permission[]>;
    findOne(id: string): Promise<Permission>;
    update(id: string, updateDto: any): Promise<Permission>;
    remove(id: string): Promise<Permission>;
}
