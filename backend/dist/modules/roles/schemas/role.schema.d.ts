import { Document, Schema as MongooseSchema } from 'mongoose';
import { Permission } from '../../permissions/schemas/permission.schema';
export declare class Role extends Document {
    name: string;
    slug: string;
    description: string;
    permissions: Permission[];
    isSystem: boolean;
    isActive: boolean;
}
export declare const RoleSchema: MongooseSchema<Role, import("mongoose").Model<Role, any, any, any, any, any, Role>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Role, Document<unknown, {}, Role, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Role & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Role, Document<unknown, {}, Role, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Role & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Role, Document<unknown, {}, Role, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Role & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Role, Document<unknown, {}, Role, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Role & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Role, Document<unknown, {}, Role, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Role & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    permissions?: import("mongoose").SchemaDefinitionProperty<Permission[], Role, Document<unknown, {}, Role, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Role & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, Role, Document<unknown, {}, Role, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Role & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isSystem?: import("mongoose").SchemaDefinitionProperty<boolean, Role, Document<unknown, {}, Role, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Role & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Role>;
