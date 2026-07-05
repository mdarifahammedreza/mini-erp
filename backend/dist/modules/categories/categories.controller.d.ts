import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createDto: CreateCategoryDto): Promise<import("./schemas/category.schema").Category>;
    findAll(page?: number, limit?: number, search?: string): Promise<any>;
    findOne(id: string): Promise<import("./schemas/category.schema").Category>;
    update(id: string, updateDto: UpdateCategoryDto): Promise<import("./schemas/category.schema").Category>;
    remove(id: string): Promise<import("./schemas/category.schema").Category>;
}
