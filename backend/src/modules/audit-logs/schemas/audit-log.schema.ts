import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { paginatePlugin, toJSONPlugin } from '../../../database/plugins';
import { User } from '../../users/schemas/user.schema';

@Schema({ collection: 'audit_logs', timestamps: { createdAt: true, updatedAt: false } })
export class AuditLog extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  userId: User;

  @Prop({ default: 'system', trim: true })
  userEmail: string;

  @Prop({
    required: true,
    trim: true,
    enum: [
      'CREATE',
      'UPDATE',
      'DELETE',
      'RESTORE',
      'LOGIN',
      'LOGOUT',
      'LOGIN_FAILED',
      'PASSWORD_CHANGE',
      'ROLE_CHANGE',
      'EXPORT',
    ],
  })
  action: string;

  @Prop({
    required: true,
    trim: true,
    enum: ['users', 'roles', 'permissions', 'products', 'categories', 'customers', 'sales', 'auth', 'settings'],
  })
  module: string;

  @Prop({ default: '', trim: true, maxlength: 500 })
  description: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  previousData: any;

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  newData: any;

  @Prop({ default: null })
  ipAddress: string;

  @Prop({ default: null })
  userAgent: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// Apply custom plugins
AuditLogSchema.plugin(paginatePlugin);
AuditLogSchema.plugin(toJSONPlugin);

// Indexes
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ module: 1, action: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });
