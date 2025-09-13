import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UserRowSkeleton = () => (
  <TableRow>
    {/* Email */}
    <TableCell className="font-medium">
      <Skeleton className="h-4 w-[180px]" />
    </TableCell>
    {/* Role */}
    <TableCell>
      <Skeleton className="h-6 w-[80px] rounded-full" />
    </TableCell>
    {/* Access Granted */}
    <TableCell>
      <Skeleton className="h-4 w-[100px]" />
    </TableCell>
    {/* Expiration */}
    <TableCell>
      <Skeleton className="h-4 w-[100px]" />
    </TableCell>
    {/* Status */}
    <TableCell>
      <Skeleton className="h-6 w-[70px] rounded-full" />
    </TableCell>
    {/* Access Toggle */}
    <TableCell>
      <Skeleton className="h-6 w-[44px] rounded-full" />
    </TableCell>
    {/* Actions */}
    <TableCell className="text-right">
      <div className="flex justify-end gap-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </TableCell>
  </TableRow>
);

export const UsersTableSkeleton = () => {
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
          <UserRowSkeleton />
          <UserRowSkeleton />
          <UserRowSkeleton />
          <UserRowSkeleton />
        </TableBody>
      </Table>
    </div>
  );
};
