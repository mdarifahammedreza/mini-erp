export declare class CreateSaleItemDto {
    product: string;
    quantity: number;
}
export declare class CreateSaleDto {
    customer: string;
    items: CreateSaleItemDto[];
    notes?: string;
    saleDate?: string;
}
