import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { Sale } from '../sales/schemas/sale.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    @InjectModel(Sale.name) private readonly saleModel: Model<Sale>,
  ) {}

  async create(createDto: CreateCustomerDto): Promise<Customer> {
    if (createDto.email) {
      const existing = await this.customerModel.findOne({ email: createDto.email.toLowerCase() }).exec();
      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }

    const created = new this.customerModel({
      ...createDto,
      email: createDto.email ? createDto.email.toLowerCase() : undefined,
    });
    return created.save();
  }

  async findAll(queryOptions: any = {}): Promise<any> {
    const { page = 1, limit = 10, search } = queryOptions;
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    return (this.customerModel as any).paginate({
      filter,
      page: Number(page),
      limit: Number(limit),
      sort: 'name',
    });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(id: string, updateDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    if (updateDto.email && updateDto.email.toLowerCase() !== customer.email) {
      const existing = await this.customerModel.findOne({ email: updateDto.email.toLowerCase() }).exec();
      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }

    const updated = await this.customerModel
      .findByIdAndUpdate(
        id,
        {
          ...updateDto,
          email: updateDto.email ? updateDto.email.toLowerCase() : customer.email,
        },
        { new: true },
      )
      .exec();
    return updated!;
  }

  async remove(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const salesCount = await this.saleModel.countDocuments({ customer: id, deletedAt: null }).exec();
    if (salesCount > 0) {
      throw new BadRequestException('Cannot delete customer with existing sales transactions');
    }

    await (customer as any).softDelete();
    return customer;
  }
}
