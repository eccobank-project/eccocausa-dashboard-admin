import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAuthorizedEmail,
  deleteAuthorizedEmail,
  toggleEmailAccess,
  updateAuthorizedEmail,
} from "../actions/mutates";
import type { UserRole } from "../types";
import type { AuthorizedEmails } from "../types/actionsTypes";
import { useEmailAuth } from "./use-emails-auth";

// Constantes
const DECIMAL_RADIX = 10;

// Constantes de roles (IDs de la base de datos)
const ROLE_SUPERADMIN: UserRole = 1;
const ROLE_ADMIN: UserRole = 3;
const ROLE_RECOLECTOR: UserRole = 4;
const DEFAULT_ROLE: UserRole = ROLE_RECOLECTOR;

// Los roles válidos que vienen de la base de datos
const VALID_ROLES: UserRole[] = [ROLE_SUPERADMIN, ROLE_ADMIN, ROLE_RECOLECTOR];

// Helper para validar si un número es un rol válido
const isValidRole = (roleId: number): roleId is UserRole => {
  return VALID_ROLES.includes(roleId as UserRole);
};

export const useUsersManagement = () => {
  const queryClient = useQueryClient();
  const {
    data: rawUsers,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useEmailAuth();

  // Transformar los datos de AuthorizedEmails a un formato más amigable
  const users =
    rawUsers?.map((user) => ({
      id: user.id.toString(),
      email: user.correo,
      role: isValidRole(user.id_rol) ? user.id_rol : DEFAULT_ROLE, // Default a rol recolector si no es válido
      accessGranted: new Date(user.fecha_registro),
      accessExpiration: new Date(user.fecha_expiracion),
      hasAccess: user.permitir_acceso,
      createdAt: new Date(user.fecha_registro),
    })) || [];

  // Helper functions para cálculos
  const isUserExpired = (expirationDate: Date) => new Date() > expirationDate;
  const isUserActive = (user: { hasAccess: boolean; accessExpiration: Date }) =>
    user.hasAccess && new Date() <= user.accessExpiration;

  // Mutación para crear usuario
  const createUserMutation = useMutation({
    mutationFn: (userData: {
      email: string;
      role: UserRole;
      accessGranted: Date;
      accessExpiration: Date;
      hasAccess: boolean;
    }) => {
      const newUser: Omit<AuthorizedEmails, "id"> = {
        correo: userData.email,
        fecha_registro: userData.accessGranted,
        fecha_expiracion: userData.accessExpiration,
        permitir_acceso: userData.hasAccess,
        id_rol: userData.role, // Ya es un número (ID del rol)
      };
      return createAuthorizedEmail(newUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizedEmails"] });
    },
  });

  // Mutación para actualizar usuario
  const updateUserMutation = useMutation({
    mutationFn: (userData: {
      id: string;
      email?: string;
      role?: UserRole;
      accessGranted?: Date;
      accessExpiration?: Date;
      hasAccess?: boolean;
    }) => {
      const updates: Partial<Omit<AuthorizedEmails, "id">> = {};

      if (userData.email !== undefined) {
        updates.correo = userData.email;
      }
      if (userData.role !== undefined) {
        updates.id_rol = userData.role; // Ya es un número (ID del rol)
      }
      if (userData.accessGranted !== undefined) {
        updates.fecha_registro = userData.accessGranted;
      }
      if (userData.accessExpiration !== undefined) {
        updates.fecha_expiracion = userData.accessExpiration;
      }
      if (userData.hasAccess !== undefined) {
        updates.permitir_acceso = userData.hasAccess;
      }

      return updateAuthorizedEmail(
        Number.parseInt(userData.id, DECIMAL_RADIX),
        updates
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizedEmails"] });
    },
  });

  // Mutación para eliminar usuario
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => {
      return deleteAuthorizedEmail(Number.parseInt(userId, DECIMAL_RADIX));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizedEmails"] });
    },
  });

  // Mutación para alternar acceso
  const toggleAccessMutation = useMutation({
    mutationFn: ({
      userId,
      hasAccess,
    }: {
      userId: string;
      hasAccess: boolean;
    }) => {
      return toggleEmailAccess(
        Number.parseInt(userId, DECIMAL_RADIX),
        hasAccess
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizedEmails"] });
    },
  });

  // Funciones helper
  const addUser = (userData: {
    email: string;
    role: UserRole;
    accessGranted: Date;
    accessExpiration: Date;
    hasAccess: boolean;
  }) => {
    return createUserMutation.mutateAsync(userData);
  };

  const editUser = (userData: {
    id: string;
    email?: string;
    role?: UserRole;
    accessGranted?: Date;
    accessExpiration?: Date;
    hasAccess?: boolean;
  }) => {
    return updateUserMutation.mutateAsync(userData);
  };

  const deleteUser = (userId: string) => {
    return deleteUserMutation.mutateAsync(userId);
  };

  const toggleUserAccess = (userId: string, hasAccess: boolean) => {
    return toggleAccessMutation.mutateAsync({ userId, hasAccess });
  };

  // Estadísticas calculadas
  const activeUsers = users.filter((user) => isUserActive(user));
  const expiredUsers = users.filter((user) =>
    isUserExpired(user.accessExpiration)
  );
  const disabledUsers = users.filter(
    (user) => !(user.hasAccess || isUserExpired(user.accessExpiration))
  );

  return {
    // Datos
    users,
    activeUsers,
    expiredUsers,
    disabledUsers,

    // Estados de carga
    isLoading, // Solo true en primera carga sin caché
    isFetching, // True cuando hay una request en background
    isLoadingMutations:
      createUserMutation.isPending ||
      updateUserMutation.isPending ||
      deleteUserMutation.isPending ||
      toggleAccessMutation.isPending,
    error,

    // Acciones
    addUser,
    editUser,
    deleteUser,
    toggleUserAccess,
    refetch,

    // Estados de mutaciones
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isToggling: toggleAccessMutation.isPending,
  };
};
