export interface RolePermission {
  _id: string;
  name: string;
  slug: string;
  module: string;
  action: string;
  description?: string;
}

export interface Role {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  permissions: (string | RolePermission)[];
  isSystem: boolean;
  isActive: boolean;
}
