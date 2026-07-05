import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { timestampPlugin, softDeletePlugin, toJSONPlugin, paginatePlugin } from '../../../database/plugins';

@Schema({ collection: 'categories' })
export class Category extends Document {
  @Prop({ required: true, unique: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true, maxlength: 100 })
  slug: string;

  @Prop({ default: '', trim: true, maxlength: 500 })
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Apply custom plugins
CategorySchema.plugin(timestampPlugin);
CategorySchema.plugin(softDeletePlugin);
CategorySchema.plugin(paginatePlugin);
CategorySchema.plugin(toJSONPlugin);

// Pre-save hook to generate slug
CategorySchema.pre('validate', function (next: any) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

// Indexes
CategorySchema.index({ isActive: 1, deletedAt: 1 });
