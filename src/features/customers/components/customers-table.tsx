/** biome-ignore-all lint/performance/noImgElement: Image element needed for profile photos */
"use client";

import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiBardLine,
  RiCheckLine,
  RiCloseCircleLine,
  RiDeleteBinLine,
  RiEditLine,
  RiErrorWarningLine,
  RiFilter3Line,
  RiMapPin2Line,
  RiMoreLine,
  RiSearch2Line,
} from "@remixicon/react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useId, useMemo, useRef, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ClientList } from "../types/client-list";

const statusFilterFn: FilterFn<ClientList> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) {
    return true;
  }

  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

type GetColumnsProps = {
  onEdit: (item: ClientList) => void;
  onDelete: (item: ClientList) => void;
};

const DECIMAL_PLACES = 4;

const getColumns = ({ onEdit, onDelete }: GetColumnsProps): ColumnDef<ClientList>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Cliente",
    accessorKey: "nombre",
    cell: ({ row }) => (
      <div className="flex h-7 items-center gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
          <img
            alt={row.getValue("nombre")}
            className="size-7 rounded-full object-cover"
            height={28}
            loading="lazy"
            src={row.original.foto || "/placeholder-avatar.png"}
            width={28}
          />
        </div>
        <div className="font-medium">{row.getValue("nombre")}</div>
      </div>
    ),
    size: 180,
    enableHiding: false,
  },
  {
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => <span className="text-muted-foreground">#{row.getValue("id")}</span>,
    size: 80,
  },
  {
    header: "Código",
    accessorKey: "codigo",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("codigo")}</span>,
    size: 120,
  },
  {
    header: "Estado",
    accessorKey: "estado",
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Badge
          className={cn(
            "gap-1 px-2 py-0.5 text-sm",
            row.original.estado === "inactivo" ? "text-muted-foreground" : "text-primary-foreground"
          )}
          variant="outline"
        >
          {row.original.estado === "activo" && (
            <RiCheckLine aria-hidden="true" className="text-emerald-500" size={14} />
          )}
          {row.original.estado === "inactivo" && "- "}
          {row.original.estado}
        </Badge>
      </div>
    ),
    size: 110,
    filterFn: statusFilterFn,
  },
  {
    header: "Tipo",
    accessorKey: "id_tipo",
    cell: ({ row }) => {
      const tipo = row.original.id_tipo;
      let tipoLabel = "Otro";
      if (tipo === 1) {
        tipoLabel = "Individual";
      } else if (tipo === 2) {
        tipoLabel = "Empresa";
      }
      return <span className="text-muted-foreground">{tipoLabel}</span>;
    },
    size: 100,
  },
  {
    header: "Ubicación",
    accessorKey: "ubicacion",
    cell: ({ row }) => {
      const { latitud, longitud } = row.original;
      const hasLocation = Boolean(latitud && longitud);
      if (!hasLocation) {
        return <span className="text-muted-foreground">No disponible</span>;
      }
      return (
        <span className="text-muted-foreground text-xs">
          {latitud.toFixed(DECIMAL_PLACES)}, {longitud.toFixed(DECIMAL_PLACES)}
        </span>
      );
    },
    size: 140,
  },
  {
    header: "Fecha Registro",
    accessorKey: "fecha_registro",
    cell: ({ row }) => {
      const fecha = new Date(row.original.fecha_registro);
      return (
        <span className="text-muted-foreground">
          {fecha.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      );
    },
    size: 130,
  },
  {
    header: "Registrador",
    accessorKey: "id_usuario_registrador",
    cell: ({ row }) => <span className="text-muted-foreground">Usuario #{row.original.id_usuario_registrador}</span>,
    size: 120,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions item={row.original} onDelete={onDelete} onEdit={onEdit} />,
    size: 60,
    enableHiding: false,
  },
];

type CustomersTableProps = {
  data: ClientList[];
  isLoading: boolean;
  onEdit: (item: ClientList) => void;
  onDelete: (item: ClientList) => void;
  onBulkDelete: (items: ClientList[]) => void;
};

export default function CustomersTable({ data, isLoading, onEdit, onDelete, onBulkDelete }: CustomersTableProps) {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "fecha_registro",
      desc: true,
    },
  ]);

  const columns = useMemo(() => getColumns({ onEdit, onDelete }), [onEdit, onDelete]);

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedItems = selectedRows.map((row) => row.original);
    onBulkDelete(selectedItems);
    table.resetRowSelection();
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  // Extract complex expressions into separate variables
  const statusColumn = table.getColumn("estado");
  const statusFacetedValues = statusColumn?.getFacetedUniqueValues();
  const statusFilterValue = statusColumn?.getFilterValue();

  // Update useMemo hooks with simplified dependencies
  const uniqueStatusValues = useMemo(() => {
    if (!statusColumn) {
      return [];
    }

    const values = Array.from(statusFacetedValues?.keys() ?? []);
    return values.sort();
  }, [statusColumn, statusFacetedValues]);

  const statusCounts = useMemo(() => {
    if (!statusColumn) {
      return new Map();
    }
    return statusFacetedValues ?? new Map();
  }, [statusColumn, statusFacetedValues]);

  const selectedStatuses = useMemo(() => {
    return (statusFilterValue as string[]) ?? [];
  }, [statusFilterValue]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("estado")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table.getColumn("estado")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Filter by name */}
          <div className="relative">
            <Input
              aria-label="Buscar por nombre"
              className={cn(
                "peer min-w-60 bg-background bg-gradient-to-br from-accent/60 to-accent ps-9",
                Boolean(table.getColumn("nombre")?.getFilterValue()) && "pe-9"
              )}
              id={`${id}-input`}
              onChange={(e) => table.getColumn("nombre")?.setFilterValue(e.target.value)}
              placeholder="Buscar por nombre"
              ref={inputRef}
              type="text"
              value={(table.getColumn("nombre")?.getFilterValue() ?? "") as string}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
              <RiSearch2Line aria-hidden="true" size={20} />
            </div>
            {Boolean(table.getColumn("nombre")?.getFilterValue()) && (
              <button
                aria-label="Limpiar filtro"
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  table.getColumn("nombre")?.setFilterValue("");
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
                type="button"
              >
                <RiCloseCircleLine aria-hidden="true" size={16} />
              </button>
            )}
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <RiDeleteBinLine aria-hidden="true" className="-ms-1 opacity-60" size={16} />
                  Eliminar
                  <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                  >
                    <RiErrorWarningLine className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente{" "}
                      {table.getSelectedRowModel().rows.length} cliente
                      {table.getSelectedRowModel().rows.length === 1 ? "" : "s"} seleccionado
                      {table.getSelectedRowModel().rows.length === 1 ? "" : "s"}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Filter by status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <RiFilter3Line aria-hidden="true" className="-ms-1.5 size-5 text-muted-foreground/60" size={20} />
                Filtrar
                {selectedStatuses.length > 0 && (
                  <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
                    {selectedStatuses.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto min-w-36 p-3">
              <div className="space-y-3">
                <div className="font-medium text-muted-foreground/60 text-xs uppercase">Estado</div>
                <div className="space-y-3">
                  {uniqueStatusValues.map((value, i) => (
                    <div className="flex items-center gap-2" key={value}>
                      <Checkbox
                        checked={selectedStatuses.includes(value)}
                        id={`${id}-${i}`}
                        onCheckedChange={(checked: boolean) => handleStatusChange(checked, value)}
                      />
                      <Label className="flex grow justify-between gap-2 font-normal" htmlFor={`${id}-${i}`}>
                        {value} <span className="ms-2 text-muted-foreground text-xs">{statusCounts.get(value)}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* New filter button */}
          <Button variant="outline">
            <RiBardLine aria-hidden="true" className="-ms-1.5 size-5 text-muted-foreground/60" size={20} />
            Nuevo Filtro
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="hover:bg-transparent" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="relative h-9 select-none border-border border-y bg-sidebar first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r"
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {(() => {
                      if (header.isPlaceholder) {
                        return null;
                      }

                      if (header.column.getCanSort()) {
                        return (
                          <button
                            className={cn("flex h-full w-full cursor-pointer select-none items-center gap-2 text-left")}
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              // Enhanced keyboard handling for sorting
                              if (header.column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                                e.preventDefault();
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                            type="button"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <RiArrowUpSLine aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
                              desc: <RiArrowDownSLine aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </button>
                        );
                      }

                      return flexRender(header.column.columnDef.header, header.getContext());
                    })()}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <tbody aria-hidden="true" className="table-row h-1" />
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <TableCell className="h-24 text-center" colSpan={columns.length}>
                    Cargando...
                  </TableCell>
                </TableRow>
              );
            }

            if (table.getRowModel().rows?.length) {
              return table.getRowModel().rows.map((row) => (
                <TableRow
                  className="h-px border-0 hover:bg-accent/50 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="h-[inherit] last:py-0" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ));
            }

            return (
              <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            );
          })()}
        </TableBody>
        <tbody aria-hidden="true" className="table-row h-1" />
      </Table>

      {/* Pagination */}
      {table.getRowModel().rows.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <p aria-live="polite" className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
            Página <span className="text-foreground">{table.getState().pagination.pageIndex + 1}</span> de{" "}
            <span className="text-foreground">{table.getPageCount()}</span>
          </p>
          <Pagination className="w-auto">
            <PaginationContent className="gap-3">
              <PaginationItem>
                <Button
                  aria-label="Ir a la página anterior"
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                  variant="outline"
                >
                  Anterior
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  aria-label="Ir a la página siguiente"
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                  variant="outline"
                >
                  Siguiente
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function RowActions({
  item,
  onEdit,
  onDelete,
}: {
  item: ClientList;
  onEdit: (item: ClientList) => void;
  onDelete: (item: ClientList) => void;
}) {
  const navigate = useNavigate();
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    startUpdateTransition(() => {
      onEdit(item);
    });
  };

  const handleViewOnMap = () => {
    navigate(`/map/${item.id}`);
  };

  const handleDelete = () => {
    startUpdateTransition(() => {
      onDelete(item);
      setShowDeleteDialog(false);
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              aria-label="Editar cliente"
              className="text-muted-foreground/60 shadow-none"
              size="icon"
              variant="ghost"
            >
              <RiMoreLine aria-hidden="true" className="size-5" size={20} />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuGroup>
            <DropdownMenuItem disabled={isUpdatePending} onClick={handleEdit}>
              <RiEditLine aria-hidden="true" className="mr-2 h-4 w-4" />
              Editar cliente
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isUpdatePending || !item.latitud || !item.longitud} onClick={handleViewOnMap}>
              <RiMapPin2Line aria-hidden="true" className="mr-2 h-4 w-4" />
              Ver en mapa
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="dark:data-[variant=destructive]:focus:bg-destructive/10"
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
          >
            <RiDeleteBinLine aria-hidden="true" className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente "{item.nombre}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdatePending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
              disabled={isUpdatePending}
              onClick={handleDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
