import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createDto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({ email: createDto.email.toLowerCase() }).exec();
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const created = new this.userModel(createDto);
    await created.save();
    return this.findOne(created._id.toString());
  }

  async findAll(queryOptions: any = {}): Promise<any> {
    const { page = 1, limit = 10, search, role } = queryOptions;
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    if (role) {
      filter.role = role;
    }

    return (this.userModel as any).paginate({
      filter,
      page: Number(page),
      limit: Number(limit),
      populate: 'role',
      sort: '-createdAt',
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).populate({
      path: 'role',
      populate: { path: 'permissions' }
    }).exec();
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .populate({
        path: 'role',
        populate: { path: 'permissions' },
      })
      .exec();
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate({
        path: 'role',
        populate: { path: 'permissions' },
      })
      .exec();
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateDto.email && updateDto.email.toLowerCase() !== user.email) {
      const existing = await this.userModel.findOne({ email: updateDto.email.toLowerCase() }).exec();
      if (existing) {
        throw new ConflictException('Email already exists');
      }
      user.email = updateDto.email.toLowerCase();
    }

    if (updateDto.firstName) user.firstName = updateDto.firstName;
    if (updateDto.lastName) user.lastName = updateDto.lastName;
    if (updateDto.avatar !== undefined) user.avatar = updateDto.avatar;
    if (updateDto.isActive !== undefined) user.isActive = updateDto.isActive;
    if (updateDto.role) user.role = updateDto.role as any;
    
    if (updateDto.password) {
      user.password = updateDto.password;
    }

    await user.save();
    return this.findOne(id);
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await (user as any).softDelete();
    return user;
  }
}
