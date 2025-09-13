import { RiDeleteBinLine, RiEditLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AuthorizedUser } from "../types";

type AuthorizedUsersTableProps = {
  users: AuthorizedUser[];
  onToggleAccess: (userId: string, hasAccess: boolean) => void;
  onEditUser: (user: AuthorizedUser) => void;
  onDeleteUser: (userId: string) => void;
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "destructive";
    case "manager":
      return "default";
    case "collector":
      return "secondary";
    case "viewer":
      return "outline";
    default:
      return "outline";
  }
};

const isExpired = (expirationDate: Date) => {
  return new Date() > expirationDate;
};

export const AuthorizedUsersTable = ({
  users,
  onToggleAccess,
  onEditUser,
  onDeleteUser,
}: AuthorizedUsersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Access Granted</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Access</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const expired = isExpired(user.accessExpiration);
            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleColor(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>{user.accessGranted.toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={expired ? "text-destructive" : ""}>
                    {user.accessExpiration.toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={expired ? "destructive" : "default"}>{expired ? "Expired" : "Active"}</Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.hasAccess}
                    disabled={expired && !user.hasAccess}
                    onCheckedChange={(checked) => onToggleAccess(user.id, checked)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => onEditUser(user)} size="sm" variant="ghost">
                      <RiEditLine size={16} />
                      <span className="sr-only">Edit user</span>
                    </Button>
                    <Button
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDeleteUser(user.id)}
                      size="sm"
                      variant="ghost"
                    >
                      <RiDeleteBinLine size={16} />
                      <span className="sr-only">Delete user</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
