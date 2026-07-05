import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    create(createDto: any): Promise<import("./schemas/permission.schema").Permission>;
    findAll(): Promise<import("./schemas/permission.schema").Permission[]>;
    findOne(id: string): Promise<import("./schemas/permission.schema").Permission>;
    update(id: string, updateDto: any): Promise<import("./schemas/permission.schema").Permission>;
    remove(id: string): Promise<import("./schemas/permission.schema").Permission>;
}
