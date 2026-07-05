import { Schema } from 'mongoose';

export const softDeletePlugin = (schema: Schema) => {
  schema.add({ deletedAt: { type: Date, default: null } });

  // Default query filter: exclude soft-deleted documents
  schema.pre(/^find/, function (next) {
    if (!this.getQuery().includeDeleted) {
      this.where({ deletedAt: null });
    } else {
      delete this.getQuery().includeDeleted;
    }
    next();
  });

  // Instance method: soft delete
  schema.methods.softDelete = function () {
    this.deletedAt = new Date();
    return this.save();
  };

  // Instance method: restore
  schema.methods.restore = function () {
    this.deletedAt = null;
    return this.save();
  };

  // Static method: soft delete by ID
  schema.statics.softDeleteById = function (id: string) {
    return this.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  };

  // Static method: restore by ID
  schema.statics.restoreById = function (id: string) {
    return this.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
  };
};
