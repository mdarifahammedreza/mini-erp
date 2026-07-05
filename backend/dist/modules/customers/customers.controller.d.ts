import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createDto: CreateCustomerDto): Promise<import("./schemas/customer.schema").Customer>;
    findAll(page?: number, limit?: number, search?: string): Promise<any>;
    findOne(id: string): Promise<import("./schemas/customer.schema").Customer>;
    update(id: string, updateDto: UpdateCustomerDto): Promise<import("./schemas/customer.schema").Customer>;
    remove(id: string): Promise<import("./schemas/customer.schema").Customer>;
}
