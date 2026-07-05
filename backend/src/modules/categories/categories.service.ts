import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { Product } from '../products/schemas/product.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createDto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryModel.findOne({ name: createDto.name }).exec();
    if (existing) {
      throw new ConflictException('Category name already exists');
    }
    const created = new this.categoryModel(createDto);
    return created.save();
  }

  async findAll(queryOptions: any = {}): Promise<any> {
    const { page = 1, limit = 10, search } = queryOptions;
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    return (this.categoryModel as any).paginate({
      filter,
      page: Number(page),
      limit: Number(limit),
      sort: 'name',
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (updateDto.name && updateDto.name !== category.name) {
      const existing = await this.categoryModel.findOne({ name: updateDto.name }).exec();
      if (existing) {
        throw new ConflictException('Category name already exists');
      }
    }

    const updated = await this.categoryModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    return updated!;
  }

  async remove(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const productCount = await this.productModel.countDocuments({ category: id, deletedAt: null }).exec();
    if (productCount > 0) {
      throw new BadRequestException('Cannot delete category with associated products');
    }

    await (category as any).softDelete();
    return category;
  }
}
