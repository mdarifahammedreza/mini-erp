import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createDto: any, file?: Express.Multer.File): Promise<import("./schemas/product.schema").Product>;
    findAll(page?: number, limit?: number, search?: string, category?: string, isActive?: string, lowStock?: string): Promise<any>;
    findOne(id: string): Promise<import("./schemas/product.schema").Product>;
    update(id: string, updateDto: any, file?: Express.Multer.File): Promise<import("./schemas/product.schema").Product>;
    remove(id: string): Promise<import("./schemas/product.schema").Product>;
    private mapAndValidateProductDto;
}
