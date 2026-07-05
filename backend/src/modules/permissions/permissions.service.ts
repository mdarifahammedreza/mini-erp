import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from './schemas/permission.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
  ) {}

  async create(createDto: any): Promise<Permission> {
    const created = new this.permissionModel(createDto);
    return created.save();
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.find().exec();
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findById(id).exec();
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
  }

  async update(id: string, updateDto: any): Promise<Permission> {
    const updated = await this.permissionModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<Permission> {
    const deleted = await this.permissionModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return deleted;
  }
}
