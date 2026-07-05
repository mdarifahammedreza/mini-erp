import { Schema } from 'mongoose';
export interface PaginateOptions {
    page?: number;
    limit?: number;
    sort?: string;
    populate?: string | any;
    select?: string;
    search?: string;
    filter?: any;
}
export interface PaginateResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        totalDocs: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
export declare const paginatePlugin: (schema: Schema) => void;
