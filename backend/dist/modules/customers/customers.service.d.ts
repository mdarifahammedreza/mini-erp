import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { Sale } from '../sales/schemas/sale.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersService {
    private readonly customerModel;
    private readonly saleModel;
    constructor(customerModel: Model<Customer>, saleModel: Model<Sale>);
    create(createDto: CreateCustomerDto): Promise<Customer>;
    findAll(queryOptions?: any): Promise<any>;
    findOne(id: string): Promise<Customer>;
    update(id: string, updateDto: UpdateCustomerDto): Promise<Customer>;
    remove(id: string): Promise<Customer>;
}
