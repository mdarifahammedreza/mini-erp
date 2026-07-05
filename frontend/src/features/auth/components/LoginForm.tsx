import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginSchema, type LoginInput } from '../schemas/login.schema';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { Lock, Mail, Loader2 } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success) {
        const userState = {
          state: {
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            isAuthenticated: true,
          },
          version: 0,
        };
        localStorage.setItem('mini-erp-auth', JSON.stringify(userState));
        
        setUser(response.data.user, response.data.accessToken);
        toast.success(`Welcome back, ${response.data.user.fullName}!`);
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Login failed.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="name@company.com"
              {...register('email')}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition duration-200 ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition duration-200 ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-md shadow-blue-500/20"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
};
