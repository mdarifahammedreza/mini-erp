"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatePlugin = void 0;
const paginatePlugin = (schema) => {
    schema.statics.paginate = async function (options) {
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
                .select(options.select || '')
                .lean(),
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
exports.paginatePlugin = paginatePlugin;
//# sourceMappingURL=paginate.plugin.js.map