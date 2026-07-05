import { Model } from 'mongoose';
import { Permission } from '../../modules/permissions/schemas/permission.schema';
import { Role } from '../../modules/roles/schemas/role.schema';
import { User } from '../../modules/users/schemas/user.schema';
import { Category } from '../../modules/categories/schemas/category.schema';
import { Product } from '../../modules/products/schemas/product.schema';
import { Customer } from '../../modules/customers/schemas/customer.schema';
export declare class SeederService {
    private readonly permissionModel;
    private readonly roleModel;
    private readonly userModel;
    private readonly categoryModel;
    private readonly productModel;
    private readonly customerModel;
    private readonly logger;
    constructor(permissionModel: Model<Permission>, roleModel: Model<Role>, userModel: Model<User>, categoryModel: Model<Category>, productModel: Model<Product>, customerModel: Model<Customer>);
    seed(): Promise<void>;
    private seedPermissions;
    private seedRoles;
    private seedUsers;
    private seedBusinessData;
}
