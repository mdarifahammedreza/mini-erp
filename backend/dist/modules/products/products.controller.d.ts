import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createDto: CreateProductDto): Promise<import("./schemas/product.schema").Product>;
    findAll(page?: number, limit?: number, search?: string, category?: string, isActive?: string, lowStock?: string): Promise<any>;
    findOne(id: string): Promise<import("./schemas/product.schema").Product>;
    update(id: string, updateDto: UpdateProductDto): Promise<import("./schemas/product.schema").Product>;
    remove(id: string): Promise<import("./schemas/product.schema").Product>;
}
