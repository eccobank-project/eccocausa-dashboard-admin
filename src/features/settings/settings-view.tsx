import { RiAddLine, RiUserLine } from "@remixicon/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthorizedUsersTable } from "./components/authorized-users-table";
import { UserDialog } from "./components/user-dialog";
import type { AuthorizedUser, CreateUserRequest } from "./types";

// Mock data - en producción esto vendría de una API
const mockUsers: AuthorizedUser[] = [
  {
    id: "1",
    email: "admin@eccobank.com",
    role: "admin",
    accessGranted: new Date("2024-01-15"),
    accessExpiration: new Date("2025-01-15"),
    hasAccess: true,
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date("2024-12-10"),
  },
  {
    id: "2",
    email: "manager@eccobank.com",
    role: "manager",
    accessGranted: new Date("2024-03-20"),
    accessExpiration: new Date("2025-03-20"),
    hasAccess: true,
    createdAt: new Date("2024-03-20"),
    lastLogin: new Date("2024-12-09"),
  },
  {
    id: "3",
    email: "collector1@eccobank.com",
    role: "collector",
    accessGranted: new Date("2024-06-10"),
    accessExpiration: new Date("2024-12-10"),
    hasAccess: false,
    createdAt: new Date("2024-06-10"),
    lastLogin: new Date("2024-11-15"),
  },
  {
    id: "4",
    email: "viewer@eccobank.com",
    role: "viewer",
    accessGranted: new Date("2024-08-05"),
    accessExpiration: new Date("2025-08-05"),
    hasAccess: true,
    createdAt: new Date("2024-08-05"),
  },
];

const SettingsView = () => {
  const [users, setUsers] = useState<AuthorizedUser[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthorizedUser | undefined>();

  const handleToggleAccess = (userId: string, hasAccess: boolean) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, hasAccess } : user)));
  };

  const handleEditUser = (user: AuthorizedUser) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleAddUser = () => {
    setEditingUser(undefined);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Clear editing state when dialog closes
      setEditingUser(undefined);
    }
  };

  const handleSubmitUser = (data: CreateUserRequest) => {
    if (editingUser) {
      // Update existing user
      setUsers((prev) => prev.map((user) => (user.id === editingUser.id ? { ...user, ...data } : user)));
    } else {
      // Add new user
      const newUser: AuthorizedUser = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setUsers((prev) => [...prev, newUser]);
    }
    // Clear editing state
    setEditingUser(undefined);
  };

  const activeUsers = users.filter((user) => user.hasAccess && new Date() <= user.accessExpiration);
  const expiredUsers = users.filter((user) => new Date() > user.accessExpiration);
  const disabledUsers = users.filter((user) => !user.hasAccess && new Date() <= user.accessExpiration);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl">User Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage authorized users, their access permissions, and system roles.
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddUser}>
          <RiAddLine size={16} />
          Add User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Total Users</h3>
            <RiUserLine className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="font-bold text-2xl">{users.length}</div>
          <p className="text-muted-foreground text-xs">Registered in system</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Active Users</h3>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </div>
          <div className="font-bold text-2xl text-green-600">{activeUsers.length}</div>
          <p className="text-muted-foreground text-xs">With current access</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Expired Access</h3>
            <div className="h-2 w-2 rounded-full bg-red-500" />
          </div>
          <div className="font-bold text-2xl text-red-600">{expiredUsers.length}</div>
          <p className="text-muted-foreground text-xs">Need renewal</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Disabled Users</h3>
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
          </div>
          <div className="font-bold text-2xl text-yellow-600">{disabledUsers.length}</div>
          <p className="text-muted-foreground text-xs">Access revoked</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 font-semibold text-lg">Authorized Users</h3>
        <AuthorizedUsersTable
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
          onToggleAccess={handleToggleAccess}
          users={users}
        />
      </div>

      {/* User Dialog */}
      <UserDialog onOpenChange={handleCloseDialog} onSubmit={handleSubmitUser} open={isDialogOpen} user={editingUser} />
    </div>
  );
};

export default SettingsView;
