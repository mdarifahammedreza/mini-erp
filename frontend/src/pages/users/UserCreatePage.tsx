import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { UserForm, useUsers } from '../../features/users';

export const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createUser } = useUsers();

  const handleSubmit = async (data: any) => {
    await createUser.mutateAsync(data);
    navigate('/users');
  };

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create New User</h1>
          <p className="text-sm text-slate-500">Register a new user account and assign permissions</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
        <UserForm
          onSubmit={handleSubmit}
          isSubmitting={createUser.isPending}
          onCancel={() => navigate('/users')}
        />
      </div>
    </div>
  );
};

export default UserCreatePage;
