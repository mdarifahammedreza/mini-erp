import React from 'react';
import { useSettings } from '../../features/settings';
import { Loader2, Shield, Save } from 'lucide-react';

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

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role);
    setRolePermissions(
      role.permissions.map((p: any) => (typeof p === 'string' ? p : p._id))
    );
  };

  const handlePermissionToggle = (permId: string) => {
    if (selectedRole?.slug === 'super-admin') return;

    setRolePermissions((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    await updateRolePermissions({
      id: selectedRole._id,
      permissions: rolePermissions,
    });
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500">Loading RBAC settings...</p>
      </div>
    );
  }

  const groupedPermissions = permissions.reduce<Record<string, any[]>>((acc, perm) => {
    const mod = perm.module;
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(perm);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage access control and operational privileges</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm h-fit space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">System Roles</h3>
          {roles.map((role) => (
            <button
              key={role._id}
              onClick={() => handleRoleSelect(role)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                selectedRole?._id === role._id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="capitalize">{role.name}</span>
                {role.slug === 'super-admin' && <Shield className="w-3.5 h-3.5" />}
              </div>
            </button>
          ))}
        </div>

        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white capitalize">
                Permissions for {selectedRole?.name}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedRole?.slug === 'super-admin'
                  ? 'Super Admin has all access privileges by default and cannot be modified.'
                  : 'Configure granular permission mappings for this user role.'}
              </p>
            </div>

            {selectedRole?.slug !== 'super-admin' && (
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            )}
          </div>

          <div className="p-6 divide-y divide-slate-100 dark:divide-slate-850 space-y-6">
            {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
              <div key={moduleName} className="pt-6 first:pt-0 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {moduleName} Module
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {perms.map((perm) => {
                    const isChecked =
                      selectedRole?.slug === 'super-admin' || rolePermissions.includes(perm._id);

                    return (
                      <label
                        key={perm._id}
                        className={`flex items-start space-x-3 p-3 rounded-lg border transition cursor-pointer select-none ${
                          isChecked
                            ? 'border-blue-200 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-950/10'
                            : 'border-slate-100 hover:bg-slate-50/50 dark:border-slate-850 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={selectedRole?.slug === 'super-admin'}
                          onChange={() => handlePermissionToggle(perm._id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white capitalize">
                            {perm.action} {moduleName}
                          </span>
                          <p className="text-[10px] text-slate-400 line-clamp-2">
                            {perm.description || `Grant permission to ${perm.action} in ${moduleName} module.`}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
