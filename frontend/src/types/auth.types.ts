export interface Permission {
  id: string;
  _id: string;
  name: string;
  slug: string;
  module: string;
  action: string;
  description?: string;
  isActive: boolean;
}

export interface Role {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description?: string;
  permissions: Permission[] | string[];
  isSystem: boolean;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string | Role;
  permissions: string[];
  avatar?: string;
  isActive: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
