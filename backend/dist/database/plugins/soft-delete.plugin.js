"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeletePlugin = void 0;
const softDeletePlugin = (schema) => {
    schema.add({ deletedAt: { type: Date, default: null } });
    schema.pre(/^find/, function () {
        const query = this.getQuery();
        if (query && !query.includeDeleted) {
            this.where({ deletedAt: null });
        }
        else if (query) {
            delete query.includeDeleted;
        }
    });
    schema.methods.softDelete = function () {
        this.deletedAt = new Date();
        return this.save();
    };
    schema.methods.restore = function () {
        this.deletedAt = null;
        return this.save();
    };
    schema.statics.softDeleteById = function (id) {
        return this.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    };
    schema.statics.restoreById = function (id) {
        return this.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
    };
};
exports.softDeletePlugin = softDeletePlugin;
//# sourceMappingURL=soft-delete.plugin.js.map