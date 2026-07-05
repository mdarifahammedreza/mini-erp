import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { Product } from '../products/schemas/product.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly categoryModel;
    private readonly productModel;
    constructor(categoryModel: Model<Category>, productModel: Model<Product>);
    create(createDto: CreateCategoryDto): Promise<Category>;
    findAll(queryOptions?: any): Promise<any>;
    findOne(id: string): Promise<Category>;
    update(id: string, updateDto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<Category>;
}
