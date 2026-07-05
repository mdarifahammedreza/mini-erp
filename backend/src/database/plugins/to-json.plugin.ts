import { Schema } from 'mongoose';

export const toJSONPlugin = (schema: Schema) => {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc: any, ret: any) => {
      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }
      delete ret.__v;
      delete ret.password; // Never expose passwords
      delete ret.deletedAt; // Hide soft-delete field from API
      return ret;
    },
  });
};
