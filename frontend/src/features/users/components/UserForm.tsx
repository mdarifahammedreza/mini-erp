import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from '../schemas/user.schema';
import { useRoles } from '../../roles';
import type { User } from '../types/user.types';

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, isSubmitting, onCancel }) => {
  const isEditing = !!initialData;
  const { data: rolesResponse, isLoading: isLoadingRoles } = useRoles();
  const roles = (rolesResponse as any)?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      password: '',
      role: initialData?.role ? (typeof initialData.role === 'string' ? initialData.role : initialData.role._id || initialData.role.id) : '',
      isActive: initialData ? initialData.isActive : true,
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values as any))} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">First Name</label>
          <input
            {...register('firstName')}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="First Name"
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Last Name</label>
          <input
            {...register('lastName')}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Last Name"
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="email@example.com"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
            {isEditing ? 'Password (leave blank to keep current)' : 'Password'}
          </label>
          <input
            {...register('password')}
            type="password"
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Role</label>
          <select
            {...register('role')}
            disabled={isLoadingRoles}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select a role...</option>
            {roles.map((role: any) => (
              <option key={role._id || role.id} value={role._id || role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.role && <p className="text-xs text-red-500">{errors.role.message as string}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="isActive"
          {...register('isActive')}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          User account is active
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isEditing ? 'Update User' : 'Create User'}</span>
        </button>
      </div>
    </form>
  );
};
