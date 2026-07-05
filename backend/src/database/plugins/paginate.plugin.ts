import { Schema } from 'mongoose';

export interface PaginateOptions {
  page?: number;       // Default: 1
  limit?: number;      // Default: 10, Max: 100
  sort?: string;       // e.g., '-createdAt' or 'name'
  populate?: string | any;   // e.g., 'category role'
  select?: string;     // e.g., 'name email'
  search?: string;     // Full-text search query
  filter?: any;        // Additional filter conditions
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

export const paginatePlugin = (schema: Schema) => {
  schema.statics.paginate = async function (options: PaginateOptions): Promise<PaginateResult<any>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));
    const skip = (page - 1) * limit;
    const sort = options.sort || '-createdAt';
    const filter = { ...options.filter, deletedAt: null };

    if (options.search) {
      filter.$text = { $search: options.search };
    }

    const [data, totalDocs] = await Promise.all([
      this.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(options.populate || '')
        .select(options.select || ''),
      this.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        totalDocs,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  };
};
