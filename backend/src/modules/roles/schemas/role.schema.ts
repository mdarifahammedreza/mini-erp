import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { timestampPlugin, softDeletePlugin, toJSONPlugin, paginatePlugin } from '../../../database/plugins';
import { Permission } from '../../permissions/schemas/permission.schema';

@Schema({ collection: 'roles' })
export class Role extends Document {
  @Prop({ required: true, unique: true, trim: true, maxlength: 50 })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true, maxlength: 50 })
  slug: string;

  @Prop({ default: '', trim: true, maxlength: 255 })
  description: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Permission' }], default: [] })
  permissions: Permission[];

  @Prop({ default: false })
  isSystem: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

// Apply custom plugins
RoleSchema.plugin(timestampPlugin);
RoleSchema.plugin(softDeletePlugin);
RoleSchema.plugin(paginatePlugin);
RoleSchema.plugin(toJSONPlugin);

// Pre-save hook to generate slug
RoleSchema.pre('validate', function (next: any) {
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
RoleSchema.index({ isActive: 1, deletedAt: 1 });
