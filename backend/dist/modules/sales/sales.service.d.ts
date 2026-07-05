import { Model, Connection } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Sale } from './schemas/sale.schema';
import { Product } from '../products/schemas/product.schema';
import { Customer } from '../customers/schemas/customer.schema';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesService {
    private readonly saleModel;
    private readonly productModel;
    private readonly customerModel;
    private readonly connection;
    private readonly eventEmitter;
    constructor(saleModel: Model<Sale>, productModel: Model<Product>, customerModel: Model<Customer>, connection: Connection, eventEmitter: EventEmitter2);
    create(createDto: CreateSaleDto, userId: string): Promise<Sale>;
    findAll(queryOptions?: any): Promise<any>;
    findOne(id: string): Promise<Sale>;
    remove(id: string): Promise<Sale>;
    private generateInvoiceNumber;
}
