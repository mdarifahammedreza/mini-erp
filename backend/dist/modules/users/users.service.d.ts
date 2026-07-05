import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    create(createDto: CreateUserDto): Promise<User>;
    findAll(queryOptions?: any): Promise<any>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailWithPassword(email: string): Promise<User | null>;
    update(id: string, updateDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
}
