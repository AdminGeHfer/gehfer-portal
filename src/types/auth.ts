export type UserRole = 'admin' | 'manager' | 'analyst' | 'user';

export type Permission = 
  | 'rnc.create' 
  | 'rnc.edit' 
  | 'rnc.delete' 
  | 'rnc.view'
  | 'rnc.assign'
  | 'user.manage'
  | 'role.manage';

export interface UserPermissions {
  role: UserRole;
  permissions: Permission[];
  department?: string;
}