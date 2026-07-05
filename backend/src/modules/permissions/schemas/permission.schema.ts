import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { timestampPlugin, softDeletePlugin, toJSONPlugin, paginatePlugin } from '../../../database/plugins';

@Schema({ collection: 'permissions' })
export class Permission extends Document {
  @Prop({ required: true, unique: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true, maxlength: 100 })
  slug: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
    enum: ['users', 'roles', 'products', 'categories', 'customers', 'sales', 'dashboard', 'audit-logs', 'settings'],
  })
  module: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
    enum: ['create', 'read', 'update', 'delete', 'manage', 'export'],
  })
  action: string;

  @Prop({ default: '', trim: true, maxlength: 255 })
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

// Apply custom plugins
PermissionSchema.plugin(timestampPlugin);
PermissionSchema.plugin(softDeletePlugin);
PermissionSchema.plugin(paginatePlugin);
PermissionSchema.plugin(toJSONPlugin);

// Indexes
PermissionSchema.index({ module: 1, action: 1 }, { unique: true });
PermissionSchema.index({ isActive: 1, deletedAt: 1 });
