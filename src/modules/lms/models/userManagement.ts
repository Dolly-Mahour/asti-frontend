export type UserRole =
  | "ADMIN"
  | "INSTRUCTOR"
  | "OPERATOR"
  | "MANAGER"
  | "Admin"
  | "Super Admin"
  | "Super Admin";

export type Department =
  | "Operations"
  | "Training"
  | "Production"
  | "HR"
  | "Finance"
  | "IT";

export type RoleFilter = "All Roles" | string;

export type DepartmentFilter = "All Departments" | Department;

export interface User {
  id: number;
  name: string;
  email: string | null;
  role: string;
  username?: string;
  password?: string;
  department?: string;
  createdAt?: string;
}

export interface UserFormData {
  id: number | null;
  name: string;
  email: string;
  password?: string;
  role: string;
  username?: string;
  department?: string;
}

export interface RoleBadgeStyle {
  bg: string;
  color: string;
}

export interface StatsCard {
  label: string;
  value: string | number;
  color: string;
}