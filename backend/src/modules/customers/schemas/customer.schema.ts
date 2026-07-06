


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { paginatePlugin, softDeletePlugin, timestampPlugin, toJSONPlugin } from '../../../database/plugins';

@Schema({ collection: 'customers' })
export class Customer extends Document {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ unique: true, sparse: true, trim: true, lowercase: true, maxlength: 100 })
  email: string;

  @Prop({ default: null, trim: true, maxlength: 20 })
  phone: string;

  @Prop({ default: null, trim: true, maxlength: 500 })
  address: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// Apply custom plugins
CustomerSchema.plugin(timestampPlugin);
CustomerSchema.plugin(softDeletePlugin);
CustomerSchema.plugin(paginatePlugin);
CustomerSchema.plugin(toJSONPlugin);

// Indexes
CustomerSchema.index({ isActive: 1, deletedAt: 1 });
CustomerSchema.index({ name: 'text', email: 'text', phone: 'text' });
