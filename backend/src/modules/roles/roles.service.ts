import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async create(createDto: CreateRoleDto): Promise<Role> {
    const created = new this.roleModel(createDto);
    return created.save();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().populate('permissions').exec();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).populate('permissions').exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findBySlug(slug: string): Promise<Role | null> {
    return this.roleModel.findOne({ slug }).populate('permissions').exec();
  }

  async update(id: string, updateDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    
    if (role.isSystem && updateDto.name && updateDto.name !== role.name) {
      throw new BadRequestException('Cannot rename system roles');
    }

    const updated = await this.roleModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('permissions')
      .exec();
    return updated!;
  }

  async remove(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    if (role.isSystem) {
      throw new BadRequestException('System roles cannot be deleted');
    }
    
    await (role as any).softDelete();
    return role;
  }
}
