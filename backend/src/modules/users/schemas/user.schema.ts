import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { timestampPlugin, softDeletePlugin, toJSONPlugin, paginatePlugin } from '../../../database/plugins';
import { Role } from '../../roles/schemas/role.schema';

@Schema({ collection: 'users' })
export class User extends Document {
  @Prop({ required: true, trim: true, maxlength: 50 })
  firstName: string;

  @Prop({ required: true, trim: true, maxlength: 50 })
  lastName: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true, maxlength: 100 })
  email: string;

  @Prop({ required: true, minlength: 8, select: false })
  password: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: true })
  role: Role;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: true })
  isActive: boolean;

  comparePassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Apply custom plugins
UserSchema.plugin(timestampPlugin);
UserSchema.plugin(softDeletePlugin);
UserSchema.plugin(paginatePlugin);
UserSchema.plugin(toJSONPlugin);

// Virtual for fullName
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, isActive: 1, deletedAt: 1 });

// Pre-save hook to hash password
UserSchema.pre('save', async function (next: any) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};
