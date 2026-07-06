export interface Role {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface User {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string | Role;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}
