import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-full text-red-500">
        <ShieldAlert className="w-16 h-16" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          You do not have the required security clearances or permissions to view this resource. Please contact your system administrator.
        </p>
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default UnauthorizedPage;
