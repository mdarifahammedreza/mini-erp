import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginSchema, type LoginInput } from '../schemas/login.schema';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { Lock, Mail, Loader2, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePassword = useCallback(() => setShowPassword((prev) => !prev), []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Email Field */}
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
          Email Address
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200" />
          <input
            id="login-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            {...register('email')}
            className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium text-white placeholder:text-slate-600 bg-slate-800/60 border transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-red-500/60 focus:ring-red-500/20 focus:border-red-500'
                : 'border-slate-700/60 focus:ring-blue-500/25 focus:border-blue-500/70 hover:border-slate-600'
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400 flex items-center gap-1.5 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label htmlFor="login-password" className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
          Password
        </label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200" />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            autoComplete="current-password"
            {...register('password')}
            className={`w-full pl-11 pr-12 py-3.5 rounded-xl text-sm font-medium text-white placeholder:text-slate-600 bg-slate-800/60 border transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.password
                ? 'border-red-500/60 focus:ring-red-500/20 focus:border-red-500'
                : 'border-slate-700/60 focus:ring-blue-500/25 focus:border-blue-500/70 hover:border-slate-600'
            }`}
          />
          <button
            type="button"
            id="toggle-password-visibility"
            onClick={togglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400 flex items-center gap-1.5 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          id="login-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-slate-600 pt-1 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
        Secured with end-to-end encryption
      </p>
    </form>
  );
};

export default LoginForm;
