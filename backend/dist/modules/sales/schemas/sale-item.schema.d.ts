import { Schema as MongooseSchema } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';
export declare class SaleItem {
    product: Product;
    productName: string;
    productSku: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
}
export declare const SaleItemSchema: MongooseSchema<SaleItem, import("mongoose").Model<SaleItem, any, any, any, any, any, SaleItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SaleItem, import("mongoose").Document<unknown, {}, SaleItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    product?: import("mongoose").SchemaDefinitionProperty<Product, SaleItem, import("mongoose").Document<unknown, {}, SaleItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    productName?: import("mongoose").SchemaDefinitionProperty<string, SaleItem, import("mongoose").Document<unknown, {}, SaleItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    productSku?: import("mongoose").SchemaDefinitionProperty<string, SaleItem, import("mongoose").Document<unknown, {}, SaleItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unitPrice?: import("mongoose").SchemaDefinitionProperty<number, SaleItem, import("mongoose").Document<unknown, {}, SaleItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, SaleItem, import("mongoose").Document<unknown, {}, SaleItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lineTotal?: import("mongoose").SchemaDefinitionProperty<number, SaleItem, import("mongoose").Document<unknown, {}, SaleItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SaleItem>;
