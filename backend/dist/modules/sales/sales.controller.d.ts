import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createDto: CreateSaleDto, userId: string): Promise<import("./schemas/sale.schema").Sale>;
    findAll(page?: number, limit?: number, search?: string, customer?: string, createdBy?: string, startDate?: string, endDate?: string): Promise<any>;
    findOne(id: string): Promise<import("./schemas/sale.schema").Sale>;
}
