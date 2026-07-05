import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesService {
    private readonly roleModel;
    constructor(roleModel: Model<Role>);
    create(createDto: CreateRoleDto): Promise<Role>;
    findAll(): Promise<Role[]>;
    findOne(id: string): Promise<Role>;
    findBySlug(slug: string): Promise<Role | null>;
    update(id: string, updateDto: UpdateRoleDto): Promise<Role>;
    remove(id: string): Promise<Role>;
}
