export type AuthorizedUser = {
  id: string;
  email: string;
  role: UserRole;
  accessGranted: Date;
  accessExpiration: Date;
  hasAccess: boolean;
  createdAt: Date;
  lastLogin?: Date;
};

// UserRole representa el ID numérico del rol en la base de datos
export type UserRole = 1 | 3 | 4;

// Mapeo de IDs a nombres para mostrar en la UI
export const ROLE_NAMES: Record<UserRole, string> = {
  1: "superadmin",
  3: "admin",
  4: "recolector",
};

export type CreateUserRequest = {
  email: string;
  role: UserRole;
  accessGranted: Date;
  accessExpiration: Date;
  hasAccess: boolean;
};

export type UpdateUserRequest = Partial<CreateUserRequest> & {
  id: string;
};
