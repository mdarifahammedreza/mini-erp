import { Document } from 'mongoose';
export declare class Permission extends Document {
    name: string;
    slug: string;
    module: string;
    action: string;
    description: string;
    isActive: boolean;
}
export declare const PermissionSchema: import("mongoose").Schema<Permission, import("mongoose").Model<Permission, any, any, any, any, any, Permission>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Permission, Document<unknown, {}, Permission, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Permission & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    module?: import("mongoose").SchemaDefinitionProperty<string, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    action?: import("mongoose").SchemaDefinitionProperty<string, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Permission>;
