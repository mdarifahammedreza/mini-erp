import { Schema } from 'mongoose';

// Wraps Mongoose's built-in timestamps with standardized configuration
export const timestampPlugin = (schema: Schema) => {
  schema.set('timestamps', { createdAt: 'createdAt', updatedAt: 'updatedAt' });
};
