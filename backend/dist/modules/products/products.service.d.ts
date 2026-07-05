import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly productModel;
    private readonly eventEmitter;
    constructor(productModel: Model<Product>, eventEmitter: EventEmitter2);
    create(createDto: CreateProductDto): Promise<Product>;
    findAll(queryOptions?: any): Promise<any>;
    findOne(id: string): Promise<Product>;
    findBySku(sku: string): Promise<Product | null>;
    update(id: string, updateDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<Product>;
}
