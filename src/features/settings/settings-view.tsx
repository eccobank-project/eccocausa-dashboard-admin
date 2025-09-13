import { RiAddLine, RiUserLine } from "@remixicon/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthorizedUsersTable } from "./components/authorized-users-table";
import { StatsGridSkeleton } from "./components/stats-grid-skeleton";
import { UserDialog } from "./components/user-dialog";
import { UsersTableSkeleton } from "./components/users-table-skeleton";
import { useUsersManagement } from "./hooks/use-users-management";
import type { AuthorizedUser, CreateUserRequest } from "./types";

const SettingsView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthorizedUser | undefined>();

  const {
    users,
    activeUsers,
    expiredUsers,
    disabledUsers,
    isLoading, // Solo true en primera carga sin caché
    isFetching, // True cuando hay request en background
    isLoadingMutations, // True cuando hay mutaciones en curso
    addUser,
    editUser,
    deleteUser,
    toggleUserAccess,
  } = useUsersManagement();

  // Mostrar skeleton solo en primera carga sin datos en caché
  // isLoading de React Query ya maneja esto correctamente - solo es true cuando:
  // 1. Es la primera request Y 2. No hay datos en caché
  const showSkeleton = isLoading;
  // Mostrar loading en botones/acciones cuando hay mutaciones
  const isPerformingActions = isLoadingMutations || isFetching;

  const handleToggleAccess = async (userId: string, hasAccess: boolean) => {
    try {
      await toggleUserAccess(userId, hasAccess);
    } catch (err) {
      console.error("Error toggling user access:", err);
    }
  };

  const handleEditUser = (user: AuthorizedUser) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
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

  const handleSubmitUser = async (data: CreateUserRequest) => {
    try {
      if (editingUser) {
        // Update existing user
        await editUser({
          id: editingUser.id,
          ...data,
        });
      } else {
        // Add new user
        await addUser(data);
      }
      // Clear editing state and close dialog
      setEditingUser(undefined);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error submitting user:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl">User Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage authorized users, their access permissions, and system roles.
            {isFetching && !isLoading && <span className="ml-2 text-blue-600">• Updating...</span>}
          </p>
        </div>
        <Button className="gap-2" disabled={isPerformingActions} onClick={handleAddUser}>
          <RiAddLine size={16} />
          Add User
        </Button>
      </div>

      {/* Statistics Cards */}
      {showSkeleton ? (
        <StatsGridSkeleton />
      ) : (
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
      )}

      {/* Users Table */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 font-semibold text-lg">Authorized Users</h3>
        {showSkeleton ? (
          <UsersTableSkeleton />
        ) : (
          <AuthorizedUsersTable
            onDeleteUser={handleDeleteUser}
            onEditUser={handleEditUser}
            onToggleAccess={handleToggleAccess}
            users={users}
          />
        )}
      </div>

      {/* User Dialog */}
      <UserDialog onOpenChange={handleCloseDialog} onSubmit={handleSubmitUser} open={isDialogOpen} user={editingUser} />
    </div>
  );
};

export default SettingsView;
