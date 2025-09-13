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

export type UserRole = "admin" | "manager" | "collector" | "viewer";

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
