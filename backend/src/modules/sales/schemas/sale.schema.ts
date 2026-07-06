import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { timestampPlugin, softDeletePlugin, toJSONPlugin, paginatePlugin } from '../../../database/plugins';
import { Customer } from '../../customers/schemas/customer.schema';
import { User } from '../../users/schemas/user.schema';
import { SaleItem, SaleItemSchema } from './sale-item.schema';

@Schema({ collection: 'sales' })
export class Sale extends Document {
  @Prop({ required: true, unique: true, trim: true })
  invoiceNumber: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Customer;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: [SaleItemSchema], required: true })
  items: SaleItem[];

  @Prop({ required: true, min: 0 })
  grandTotal: number;

  @Prop({ default: '', trim: true, maxlength: 1000 })
  notes: string;

  @Prop({ type: Date, default: Date.now })
  saleDate: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

// Apply custom plugins
SaleSchema.plugin(timestampPlugin);
SaleSchema.plugin(softDeletePlugin);
SaleSchema.plugin(paginatePlugin);
SaleSchema.plugin(toJSONPlugin);

// Validation for items length
SaleSchema.path('items').validate(function (value: any[]) {
  return value && value.length > 0;
}, 'Sale must have at least one item');

// Indexes
SaleSchema.index({ customer: 1, saleDate: -1 });
SaleSchema.index({ createdBy: 1, saleDate: -1 });
SaleSchema.index({ saleDate: -1 });
SaleSchema.index({ deletedAt: 1, saleDate: -1 });
