import React from 'react';
import { useSettings } from '../../features/settings';
import {
  Loader2,
  Shield,
  Save,
  Lock,
  Users,
  Settings,
  ChevronRight,
  CheckSquare,
  Square,
  BadgeCheck,
} from 'lucide-react';

// ─── Module accent colors cycling through a palette ───────────────────────────
const MODULE_ACCENT_COLORS = [
  'border-blue-500',
  'border-indigo-500',
  'border-violet-500',
  'border-purple-500',
  'border-fuchsia-500',
  'border-pink-500',
  'border-rose-500',
  'border-orange-500',
  'border-amber-500',
  'border-teal-500',
  'border-emerald-500',
  'border-cyan-500',
];

const MODULE_ICON_BG_COLORS = [
  'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
  'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400',
  'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400',
  'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
  'bg-fuchsia-50 dark:bg-fuchsia-950/30 text-fuchsia-600 dark:text-fuchsia-400',
  'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400',
  'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400',
  'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400',
  'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
  'bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400',
  'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
  'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400',
];

// ─── Loading skeleton ──────────────────────────────────────────────────────────
const RolesPageSkeleton: React.FC = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-8 w-56 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm h-fit space-y-2">
        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>

      <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
          <div className="space-y-2">
            <div className="h-5 w-44 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>
        <div className="p-6 space-y-6">
          {[...Array(3)].map((_, moduleIdx) => (
            <div
              key={moduleIdx}
              className="space-y-3 pl-4 border-l-4 border-slate-200 dark:border-slate-700 animate-pulse"
              style={{ animationDelay: `${moduleIdx * 120}ms` }}
            >
              <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"
                    style={{ animationDelay: `${(moduleIdx * 6 + i) * 40}ms` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Main component ────────────────────────────────────────────────────────────
export const RolesPage: React.FC = () => {
  const { roles, permissions, isLoading, updateRolePermissions, isUpdating } = useSettings();
  const [selectedRole, setSelectedRole] = React.useState<any | null>(null);
  const [rolePermissions, setRolePermissions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      const initialRole = roles.find((r) => r.slug !== 'super-admin') || roles[0];
      setSelectedRole(initialRole);
      setRolePermissions(
        initialRole.permissions.map((p: any) => (typeof p === 'string' ? p : p._id))
      );
    }
  }, [roles, selectedRole]);

  const handleRoleSelect = React.useCallback((role: any) => {
    setSelectedRole(role);
    setRolePermissions(
      role.permissions.map((p: any) => (typeof p === 'string' ? p : p._id))
    );
  }, []);

  const handlePermissionToggle = React.useCallback(
    (permId: string) => {
      if (selectedRole?.slug === 'super-admin') return;
      setRolePermissions((prev) =>
        prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
      );
    },
    [selectedRole?.slug]
  );

  const handleSave = React.useCallback(async () => {
    if (!selectedRole) return;
    await updateRolePermissions({
      id: selectedRole._id,
      permissions: rolePermissions,
    });
  }, [selectedRole, rolePermissions, updateRolePermissions]);

  if (isLoading) {
    return <RolesPageSkeleton />;
  }

  const groupedPermissions = permissions.reduce<Record<string, any[]>>((acc, perm) => {
    const mod = perm.module;
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(perm);
    return acc;
  }, {});

  const moduleEntries = Object.entries(groupedPermissions);
  const isSuperAdmin = selectedRole?.slug === 'super-admin';
  const permCount = isSuperAdmin ? permissions.length : rolePermissions.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Roles &amp; Permissions
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage access control and operational privileges across the system
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Left Panel: Role List */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm h-fit space-y-1.5">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                System Roles
              </span>
            </div>
            <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full px-2 py-0.5">
              {roles.length}
            </span>
          </div>

          {roles.map((role, idx) => {
            const isActive = selectedRole?._id === role._id;
            const isSuper = role.slug === 'super-admin';

            return (
              <button
                key={role._id}
                onClick={() => handleRoleSelect(role)}
                style={{ animationDelay: `${idx * 60}ms` }}
                className={[
                  'w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium',
                  'transition-all duration-200 group relative',
                  'animate-in fade-in slide-in-from-left-2',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isActive ? (
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/80" />
                    ) : (
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-blue-400 transition-colors" />
                    )}
                    <span className="capitalize truncate">{role.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isSuper && (
                      <Shield
                        className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-amber-500'}`}
                      />
                    )}
                    {isActive ? (
                      <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Panel: Permissions */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">

          {/* Panel header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-950/30">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-bold text-base capitalize bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {selectedRole?.name ?? '—'}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full px-2 py-0.5">
                  <BadgeCheck className="w-3 h-3" />
                  {permCount} permission{permCount !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {isSuperAdmin
                  ? 'Super Admin has all access privileges by default and cannot be modified.'
                  : 'Configure granular permission mappings for this user role.'}
              </p>
            </div>

            {!isSuperAdmin && (
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white',
                  'bg-gradient-to-r from-blue-600 to-indigo-600',
                  'hover:from-blue-500 hover:to-indigo-500',
                  'shadow-md shadow-blue-500/20',
                  'transition-all duration-200',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100',
                ].join(' ')}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isUpdating ? 'Saving…' : 'Save Changes'}</span>
              </button>
            )}
          </div>

          {/* Super-admin locked banner */}
          {isSuperAdmin && (
            <div className="mx-6 mt-5 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex-shrink-0">
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Super Admin — Full Access
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-0.5">
                  This role has unrestricted access to all modules and cannot be modified.
                  All permissions below are automatically granted.
                </p>
              </div>
            </div>
          )}

          {/* Permission groups */}
          <div className="p-6 space-y-7 overflow-auto">
            {moduleEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckSquare className="w-16 h-16 text-slate-200 dark:text-slate-700 mb-4" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  No permissions found
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                  No permissions are defined in the system yet.
                </p>
              </div>
            ) : (
              moduleEntries.map(([moduleName, perms], moduleIdx) => {
                const accentColor = MODULE_ACCENT_COLORS[moduleIdx % MODULE_ACCENT_COLORS.length];
                const iconBgColor = MODULE_ICON_BG_COLORS[moduleIdx % MODULE_ICON_BG_COLORS.length];

                return (
                  <div
                    key={moduleName}
                    className={`pl-4 border-l-4 ${accentColor} space-y-3 animate-in fade-in slide-in-from-left-2 duration-300`}
                    style={{ animationDelay: `${moduleIdx * 80}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${iconBgColor}`}
                      >
                        {moduleName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-600 font-medium">
                        {perms.length} rule{perms.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {perms.map((perm, permIdx) => {
                        const isChecked = isSuperAdmin || rolePermissions.includes(perm._id);

                        return (
                          <label
                            key={perm._id}
                            style={{ animationDelay: `${(moduleIdx * 6 + permIdx) * 35}ms` }}
                            className={[
                              'group flex items-start gap-3 p-3 rounded-xl border',
                              'transition-all duration-200 animate-in fade-in select-none',
                              isSuperAdmin ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]',
                              isChecked
                                ? 'border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/10 shadow-sm shadow-blue-100 dark:shadow-blue-900/20'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/40',
                            ].join(' ')}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isSuperAdmin}
                                onChange={() => handlePermissionToggle(perm._id)}
                                className="sr-only"
                              />
                              {isChecked ? (
                                <CheckSquare
                                  className={`w-4 h-4 transition-colors ${
                                    isSuperAdmin
                                      ? 'text-amber-500'
                                      : 'text-blue-600 dark:text-blue-400'
                                  }`}
                                />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors" />
                              )}
                            </div>

                            <div className="min-w-0 space-y-0.5">
                              <p
                                className={`text-xs font-semibold capitalize leading-tight ${
                                  isChecked
                                    ? 'text-blue-700 dark:text-blue-300'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {perm.action} {moduleName}
                              </p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug line-clamp-2">
                                {perm.description ||
                                  `Grant permission to ${perm.action} in the ${moduleName} module.`}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
