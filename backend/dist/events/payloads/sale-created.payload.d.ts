export declare class SaleCreatedPayload {
    saleId: string;
    customerId: string;
    grandTotal: number;
    items: {
        productId: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }[];
    createdBy: string;
}
