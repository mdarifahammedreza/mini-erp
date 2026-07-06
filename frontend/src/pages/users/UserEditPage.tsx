import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { UserForm, useUsers, useUser } from '../../features/users';

export const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: user, isLoading: isLoadingUser } = useUser(id!);
  const { updateUser } = useUsers();

  const handleSubmit = async (data: any) => {
    // If the password is empty string, we want to remove it from the payload
    const payload = { ...data };
    if (!payload.password) {
      delete payload.password;
    }
    
    await updateUser.mutateAsync({ id: id!, data: payload });
    navigate('/users');
  };

  if (isLoadingUser) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-900">User not found</h3>
        <button
          onClick={() => navigate('/users')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Return to users list
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/users')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit User</h1>
          <p className="text-sm text-slate-500">Update account details for {(user as any)?.data?.firstName} {(user as any)?.data?.lastName}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
        <UserForm
          initialData={(user as any)?.data}
          onSubmit={handleSubmit}
          isSubmitting={updateUser.isPending}
          onCancel={() => navigate('/users')}
        />
      </div>
    </div>
  );
};

export default UserEditPage;
