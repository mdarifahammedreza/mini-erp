import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createDto: CreateProductDto): Promise<Product> {
    const existing = await this.productModel.findOne({ sku: createDto.sku.toUpperCase() }).exec();
    if (existing) {
      throw new ConflictException(`Product with SKU ${createDto.sku} already exists`);
    }

    const created = new this.productModel({
      ...createDto,
      sku: createDto.sku.toUpperCase(),
    });
    const saved = await created.save();

    const populated = await this.findOne(saved._id.toString());
    
    this.eventEmitter.emit('product.created', populated);

    if (populated.stockQuantity < 5) {
      this.eventEmitter.emit('stock.low', {
        productId: populated._id.toString(),
        sku: populated.sku,
        name: populated.name,
        stockQuantity: populated.stockQuantity,
      });
    }

    return populated;
  }

  async findAll(queryOptions: any = {}): Promise<any> {
    const { page = 1, limit = 10, search, category, isActive, lowStock } = queryOptions;
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { sku: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true' || isActive === true;
    }

    if (lowStock === 'true' || lowStock === true) {
      filter.stockQuantity = { $lt: 5 };
    }

    return (this.productModel as any).paginate({
      filter,
      page: Number(page),
      limit: Number(limit),
      populate: 'category',
      sort: 'name',
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('category').exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.productModel.findOne({ sku: sku.toUpperCase() }).populate('category').exec();
  }

  async update(id: string, updateDto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (updateDto.sku && updateDto.sku.toUpperCase() !== product.sku) {
      const existing = await this.productModel.findOne({ sku: updateDto.sku.toUpperCase() }).exec();
      if (existing) {
        throw new ConflictException(`Product with SKU ${updateDto.sku} already exists`);
      }
    }

    const updated = await this.productModel
      .findByIdAndUpdate(
        id,
        {
          ...updateDto,
          sku: updateDto.sku ? updateDto.sku.toUpperCase() : product.sku,
        },
        { new: true },
      )
      .populate('category')
      .exec();

    this.eventEmitter.emit('product.updated', updated);

    if (updated!.stockQuantity < 5) {
      this.eventEmitter.emit('stock.low', {
        productId: updated!._id.toString(),
        sku: updated!.sku,
        name: updated!.name,
        stockQuantity: updated!.stockQuantity,
      });
    }

    return updated!;
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await (product as any).softDelete();
    return product;
  }
}
