import React from 'react';
import { LoginForm } from '../../features/auth';
import { BarChart2, Package, Users, TrendingUp, ShoppingCart } from 'lucide-react';

const FeaturePill: React.FC<{ icon: React.ReactNode; label: string; delay?: string }> = ({
  icon,
  label,
  delay = '0s',
}) => (
  <div
    className="flex items-center gap-2.5 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-slate-300 font-medium"
    style={{ animationDelay: delay }}
  >
    <span className="text-blue-400">{icon}</span>
    {label}
  </div>
);

const StatCard: React.FC<{ value: string; label: string; color: string }> = ({ value, label, color }) => (
  <div className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">
    <span className={`text-2xl font-bold ${color}`}>{value}</span>
    <span className="text-xs text-slate-400">{label}</span>
  </div>
);

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#0c0e1a]">
      {/* ── Left Panel – Branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] flex-col relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1230] via-[#0c1040] to-[#0a0e1a]" />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Mini ERP</span>
            <span className="ml-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5 uppercase tracking-wider">
              v2.0
            </span>
          </div>

          {/* Hero copy */}
          <div className="py-12 xl:py-16 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Enterprise Management Platform
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight text-white">
              Run your business
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                smarter, faster.
              </span>
            </h1>

            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              Unified inventory, sales, customer management and real-time analytics — everything your team needs in one place.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <FeaturePill icon={<Package className="w-3.5 h-3.5" />} label="Inventory" />
              <FeaturePill icon={<ShoppingCart className="w-3.5 h-3.5" />} label="Sales" />
              <FeaturePill icon={<Users className="w-3.5 h-3.5" />} label="Customers" />
              <FeaturePill icon={<TrendingUp className="w-3.5 h-3.5" />} label="Analytics" />
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-auto">
            <div className="grid grid-cols-3 gap-3">
              <StatCard value="99.9%" label="Uptime SLA" color="text-emerald-400" />
              <StatCard value="< 1s" label="Response Time" color="text-blue-400" />
              <StatCard value="256-bit" label="Encryption" color="text-violet-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel – Login Form ──────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 relative">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Mini ERP</span>
        </div>

        {/* Card */}
        <div className="w-full max-w-[400px] space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-500">Sign in to your workspace to continue</p>
          </div>

          {/* Divider with label */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600 font-medium shrink-0">Enter your credentials</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Form */}
          <LoginForm />
        </div>

        {/* Bottom footer */}
        <p className="absolute bottom-6 text-xs text-slate-700 text-center">
          © {new Date().getFullYear()} Mini ERP System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
