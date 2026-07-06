import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from '../../modules/permissions/schemas/permission.schema';
import { Role } from '../../modules/roles/schemas/role.schema';
import { User } from '../../modules/users/schemas/user.schema';
import { Category } from '../../modules/categories/schemas/category.schema';
import { Product } from '../../modules/products/schemas/product.schema';
import { Customer } from '../../modules/customers/schemas/customer.schema';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  async onModuleInit() {
    await this.seed();
  }

  constructor(
    @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
  ) {}

  async seed() {
    this.logger.log('Seeding permissions...');
    const permissions = await this.seedPermissions();

    this.logger.log('Seeding roles...');
    const roles = await this.seedRoles(permissions);

    this.logger.log('Seeding users...');
    await this.seedUsers(roles);

    this.logger.log('Seeding categories, products, and customers...');
    await this.seedBusinessData();
  }

  private async seedPermissions(): Promise<Map<string, Permission>> {
    const permissionDefinitions = [
      // Users
      { name: 'Create User', slug: 'users.create', module: 'users', action: 'create' },
      { name: 'Read User', slug: 'users.read', module: 'users', action: 'read' },
      { name: 'Update User', slug: 'users.update', module: 'users', action: 'update' },
      { name: 'Delete User', slug: 'users.delete', module: 'users', action: 'delete' },
      { name: 'Manage Users', slug: 'users.manage', module: 'users', action: 'manage' },
      // Roles
      { name: 'Create Role', slug: 'roles.create', module: 'roles', action: 'create' },
      { name: 'Read Role', slug: 'roles.read', module: 'roles', action: 'read' },
      { name: 'Update Role', slug: 'roles.update', module: 'roles', action: 'update' },
      { name: 'Delete Role', slug: 'roles.delete', module: 'roles', action: 'delete' },
      { name: 'Manage Roles', slug: 'roles.manage', module: 'roles', action: 'manage' },
      // Permissions
      { name: 'Create Permission', slug: 'permissions.create', module: 'permissions', action: 'create' },
      { name: 'Read Permission', slug: 'permissions.read', module: 'permissions', action: 'read' },
      { name: 'Update Permission', slug: 'permissions.update', module: 'permissions', action: 'update' },
      { name: 'Delete Permission', slug: 'permissions.delete', module: 'permissions', action: 'delete' },
      { name: 'Manage Permissions', slug: 'permissions.manage', module: 'permissions', action: 'manage' },
      // Products
      { name: 'Create Product', slug: 'products.create', module: 'products', action: 'create' },
      { name: 'Read Product', slug: 'products.read', module: 'products', action: 'read' },
      { name: 'Update Product', slug: 'products.update', module: 'products', action: 'update' },
      { name: 'Delete Product', slug: 'products.delete', module: 'products', action: 'delete' },
      { name: 'Export Products', slug: 'products.export', module: 'products', action: 'export' },
      // Categories
      { name: 'Create Category', slug: 'categories.create', module: 'categories', action: 'create' },
      { name: 'Read Category', slug: 'categories.read', module: 'categories', action: 'read' },
      { name: 'Update Category', slug: 'categories.update', module: 'categories', action: 'update' },
      { name: 'Delete Category', slug: 'categories.delete', module: 'categories', action: 'delete' },
      // Customers
      { name: 'Create Customer', slug: 'customers.create', module: 'customers', action: 'create' },
      { name: 'Read Customer', slug: 'customers.read', module: 'customers', action: 'read' },
      { name: 'Update Customer', slug: 'customers.update', module: 'customers', action: 'update' },
      { name: 'Delete Customer', slug: 'customers.delete', module: 'customers', action: 'delete' },
      { name: 'Export Customers', slug: 'customers.export', module: 'customers', action: 'export' },
      // Sales
      { name: 'Create Sale', slug: 'sales.create', module: 'sales', action: 'create' },
      { name: 'Read Sale', slug: 'sales.read', module: 'sales', action: 'read' },
      { name: 'Export Sales', slug: 'sales.export', module: 'sales', action: 'export' },
      // Dashboard
      { name: 'Read Dashboard', slug: 'dashboard.read', module: 'dashboard', action: 'read' },
      // Audit Logs
      { name: 'Read Audit Logs', slug: 'audit-logs.read', module: 'audit-logs', action: 'read' },
      { name: 'Export Audit Logs', slug: 'audit-logs.export', module: 'audit-logs', action: 'export' },
    ];

    const permissionMap = new Map<string, Permission>();

    for (const def of permissionDefinitions) {
      let permission = await this.permissionModel.findOne({ slug: def.slug });
      if (!permission) {
        permission = await this.permissionModel.create(def);
        this.logger.log(`Created permission: ${def.slug}`);
      }
      permissionMap.set(def.slug, permission);
    }

    return permissionMap;
  }

  private async seedRoles(permissionMap: Map<string, Permission>): Promise<Map<string, Role>> {
    const allPermissionIds = Array.from(permissionMap.values()).map((p) => p._id);

    const roleDefinitions = [
      {
        name: 'Super Admin',
        slug: 'super-admin',
        description: 'Super Admin with absolute controls',
        isSystem: true,
        permissions: allPermissionIds,
      },
      {
        name: 'Admin',
        slug: 'admin',
        description: 'Administrator with full system controls',
        isSystem: true,
        permissions: allPermissionIds,
      },
      {
        name: 'Manager',
        slug: 'manager',
        description: 'Manager with catalog and sales controls',
        isSystem: true,
        permissions: [
          'products.create', 'products.read', 'products.update', 'products.delete', 'products.export',
          'categories.create', 'categories.read', 'categories.update', 'categories.delete',
          'customers.create', 'customers.read', 'customers.update', 'customers.delete', 'customers.export',
          'sales.create', 'sales.read', 'sales.export',
          'dashboard.read',
        ].map((slug) => permissionMap.get(slug)?._id).filter(Boolean),
      },
      {
        name: 'Employee',
        slug: 'employee',
        description: 'Staff member with basic registry controls',
        isSystem: true,
        permissions: [
          'products.read',
          'customers.create', 'customers.read', 'customers.update',
          'sales.create', 'sales.read',
          'dashboard.read',
        ].map((slug) => permissionMap.get(slug)?._id).filter(Boolean),
      },
      {
        name: 'Teacher',
        slug: 'teacher',
        description: 'Academic instructor role',
        isSystem: true,
        permissions: [
          'products.read',
          'customers.read',
          'dashboard.read',
        ].map((slug) => permissionMap.get(slug)?._id).filter(Boolean),
      },
      {
        name: 'Student',
        slug: 'student',
        description: 'Student role',
        isSystem: true,
        permissions: [
          'products.read',
          'dashboard.read',
        ].map((slug) => permissionMap.get(slug)?._id).filter(Boolean),
      },
      {
        name: 'User',
        slug: 'user',
        description: 'Standard end user',
        isSystem: true,
        permissions: [
          'products.read',
          'dashboard.read',
        ].map((slug) => permissionMap.get(slug)?._id).filter(Boolean),
      },
    ];

    const roleMap = new Map<string, Role>();

    for (const def of roleDefinitions) {
      let role = await this.roleModel.findOne({ slug: def.slug });
      if (!role) {
        role = await this.roleModel.create(def as any);
        this.logger.log(`Created role: ${def.slug}`);
      } else {
        role.permissions = def.permissions as any;
        await role.save();
      }
      roleMap.set(def.slug, role);
    }

    return roleMap;
  }

  private async seedUsers(roleMap: Map<string, Role>) {
    const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@erp.com';
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD || 'Password123!';

    const usersToSeed = [
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: superAdminEmail,
        password: superAdminPassword,
        role: roleMap.get('super-admin')?._id,
        isActive: true,
      },
      {
        firstName: 'Default',
        lastName: 'Admin',
        email: 'admin@erp.com',
        password: 'Password123!',
        role: roleMap.get('admin')?._id,
        isActive: true,
      },
      {
        firstName: 'John',
        lastName: 'Manager',
        email: 'manager@erp.com',
        password: 'Password123!',
        role: roleMap.get('manager')?._id,
        isActive: true,
      },
      {
        firstName: 'Jane',
        lastName: 'Employee',
        email: 'employee@erp.com',
        password: 'Password123!',
        role: roleMap.get('employee')?._id,
        isActive: true,
      },
    ];

    for (const u of usersToSeed) {
      try {
        const exists = await this.userModel.findOne({ email: u.email });
        if (!exists) {
          const newUser = new this.userModel(u);
          await newUser.save();
          this.logger.log(`Created user: ${u.email}`);
        }
      } catch (error: any) {
        if (error.code === 11000) {
          this.logger.warn(`User ${u.email} already exists (soft-deleted). Skipping.`);
        }
      }
    }
  }

  private async seedBusinessData() {
    const categoriesData = [
      { name: 'Electronics', description: 'Gadgets, phones, laptops' },
      { name: 'Furniture', description: 'Desks, chairs, tables' },
      { name: 'Office Supplies', description: 'Papers, pens, staplers' },
    ];

    const categoryMap = new Map<string, Category>();
    for (const cat of categoriesData) {
      try {
        let category = await this.categoryModel.findOne({ name: cat.name });
        if (!category) {
          category = await this.categoryModel.create(cat);
          this.logger.log(`Created category: ${cat.name}`);
        }
        if (category) categoryMap.set(cat.name, category);
      } catch (error: any) {
        if (error.code === 11000) this.logger.warn(`Category ${cat.name} already exists (soft-deleted). Skipping.`);
      }
    }

    const productsData = [
      {
        name: 'Wireless Mouse',
        sku: 'ELEC-WLM-001',
        category: categoryMap.get('Electronics')?._id,
        purchasePrice: 15,
        sellingPrice: 35,
        stockQuantity: 50,
        image: 'uploads/products/wireless-mouse.webp',
        description: 'Ergonomic 2.4GHz wireless mouse.',
      },
      {
        name: 'Mechanical Keyboard',
        sku: 'ELEC-MEK-002',
        category: categoryMap.get('Electronics')?._id,
        purchasePrice: 45,
        sellingPrice: 89.99,
        stockQuantity: 20,
        image: 'uploads/products/mech-keyboard.webp',
        description: 'Tactile mechanical keyboard with RGB.',
      },
      {
        name: 'Office Chair',
        sku: 'FURN-OFC-001',
        category: categoryMap.get('Furniture')?._id,
        purchasePrice: 80,
        sellingPrice: 150,
        stockQuantity: 12,
        image: 'uploads/products/office-chair.webp',
        description: 'Comfortable mesh office chair with lumbar support.',
      },
      {
        name: 'Gel Pens pack of 10',
        sku: 'OFFI-GEL-001',
        category: categoryMap.get('Office Supplies')?._id,
        purchasePrice: 2,
        sellingPrice: 5.99,
        stockQuantity: 3,
        image: 'uploads/products/gel-pens.webp',
        description: 'Smooth black ink gel pens.',
      },
    ];

    for (const prod of productsData) {
      try {
        const exists = await this.productModel.findOne({ sku: prod.sku });
        if (!exists) {
          await this.productModel.create(prod);
          this.logger.log(`Created product: ${prod.sku}`);
        }
      } catch (error: any) {
        if (error.code === 11000) this.logger.warn(`Product ${prod.sku} already exists (soft-deleted). Skipping.`);
      }
    }

    const customersData = [
      { name: 'Acme Corp', email: 'billing@acme.com', phone: '123-456-7890', address: '123 Industrial Way' },
      { name: 'Wayne Enterprises', email: 'finance@wayne.com', phone: '555-0199', address: '1007 Mountain Drive' },
      { name: 'Stark Industries', email: 'accounts@stark.com', phone: '999-0100', address: '10880 Malibu Point' },
    ];

    for (const cust of customersData) {
      try {
        const exists = await this.customerModel.findOne({ email: cust.email });
        if (!exists) {
          await this.customerModel.create(cust);
          this.logger.log(`Created customer: ${cust.name}`);
        }
      } catch (error: any) {
        if (error.code === 11000) this.logger.warn(`Customer ${cust.email} already exists (soft-deleted). Skipping.`);
      }
    }
  }
}
