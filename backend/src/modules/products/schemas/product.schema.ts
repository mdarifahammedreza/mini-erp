import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { timestampPlugin, softDeletePlugin, toJSONPlugin, paginatePlugin } from '../../../database/plugins';
import { Category } from '../../categories/schemas/category.schema';

@Schema({ collection: 'products' })
export class Product extends Document {
  @Prop({ required: true, trim: true, maxlength: 200 })
  name: string;

  @Prop({ required: true, unique: true, trim: true, uppercase: true, maxlength: 50 })
  sku: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @Prop({ required: true, min: 0 })
  purchasePrice: number;

  @Prop({ required: true, min: 0 })
  sellingPrice: number;

  @Prop({ required: true, min: 0, default: 0 })
  stockQuantity: number;

  @Prop({ required: true })
  image: string;

  @Prop({ default: '', trim: true, maxlength: 1000 })
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Apply custom plugins
ProductSchema.plugin(timestampPlugin);
ProductSchema.plugin(softDeletePlugin);
ProductSchema.plugin(paginatePlugin);
ProductSchema.plugin(toJSONPlugin);

// Virtuals
ProductSchema.virtual('profitMargin').get(function () {
  if (this.purchasePrice === 0) return 100;
  return ((this.sellingPrice - this.purchasePrice) / this.purchasePrice) * 100;
});

ProductSchema.virtual('isLowStock').get(function () {
  return this.stockQuantity < 5;
});

ProductSchema.virtual('unitPrice').get(function () {
  return this.sellingPrice;
});

ProductSchema.virtual('imageUrl').get(function () {
  if (!this.image) return '';
  return this.image.startsWith('/') ? this.image : `/${this.image}`;
});

// Indexes
ProductSchema.index({ sku: 1 });
ProductSchema.index({ category: 1, isActive: 1, deletedAt: 1 });
ProductSchema.index({ stockQuantity: 1, isActive: 1, deletedAt: 1 });
ProductSchema.index({ sellingPrice: 1 });
ProductSchema.index({ name: 'text', sku: 'text', description: 'text' });
