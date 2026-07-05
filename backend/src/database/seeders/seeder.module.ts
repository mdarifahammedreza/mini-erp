import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from '../../modules/permissions/schemas/permission.schema';
import { Role, RoleSchema } from '../../modules/roles/schemas/role.schema';
import { User, UserSchema } from '../../modules/users/schemas/user.schema';
import { Category, CategorySchema } from '../../modules/categories/schemas/category.schema';
import { Product, ProductSchema } from '../../modules/products/schemas/product.schema';
import { Customer, CustomerSchema } from '../../modules/customers/schemas/customer.schema';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
