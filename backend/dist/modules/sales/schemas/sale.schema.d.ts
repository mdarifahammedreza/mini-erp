import { Document, Schema as MongooseSchema } from 'mongoose';
import { Customer } from '../../customers/schemas/customer.schema';
import { User } from '../../users/schemas/user.schema';
import { SaleItem } from './sale-item.schema';
export declare class Sale extends Document {
    invoiceNumber: string;
    customer: Customer;
    createdBy: User;
    items: SaleItem[];
    grandTotal: number;
    notes: string;
    saleDate: Date;
}
export declare const SaleSchema: MongooseSchema<Sale, import("mongoose").Model<Sale, any, any, any, any, any, Sale>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Sale, Document<unknown, {}, Sale, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Sale & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    invoiceNumber?: import("mongoose").SchemaDefinitionProperty<string, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customer?: import("mongoose").SchemaDefinitionProperty<Customer, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<User, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<SaleItem[], Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    grandTotal?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    saleDate?: import("mongoose").SchemaDefinitionProperty<Date, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Sale>;
