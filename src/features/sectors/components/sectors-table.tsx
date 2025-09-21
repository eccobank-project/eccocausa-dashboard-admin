import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, MapPin, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteSector } from "../hooks/use-sector-mutations";
import type { Sector } from "../types";

type SectorsTableProps = {
  data: Sector[];
  isLoading: boolean;
  onEdit: (sector: Sector) => void;
  onMapView?: (sector: Sector) => void;
};

export const SectorsTable = ({ data, isLoading, onEdit, onMapView }: SectorsTableProps) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const deleteMutation = useDeleteSector();

  const handleDelete = async (sector: Sector) => {
    try {
      setDeletingId(sector.id);
      await deleteMutation.mutateAsync(sector.id);
    } catch (error) {
      console.error("Failed to delete sector:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "N/A";
    }
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sectores Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, index) => index + 1).map((item) => (
              <div className="flex items-center gap-4" key={`skeleton-item-${item}`}>
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sectores Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">No hay sectores registrados</h3>
            <p className="text-muted-foreground text-sm">Crea tu primer sector usando el formulario de arriba.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Sectores Registrados ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Ciudad ID</TableHead>
                <TableHead>Día Recojo</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((sector) => (
                <TableRow key={sector.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full border-2 border-border"
                        style={{ backgroundColor: sector.color }}
                      />
                      <Badge className="font-mono text-xs" variant="secondary">
                        {sector.color}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{sector.nombre}</div>
                    <div className="text-muted-foreground text-sm">ID: {sector.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{sector.id_ciudad}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className="capitalize" variant="outline">
                      {sector.dia_recojo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(sector.created_at)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button disabled={deletingId === sector.id} size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onMapView && (
                          <DropdownMenuItem onClick={() => onMapView(sector)}>
                            <MapPin className="mr-2 h-4 w-4" />
                            Ver en Mapa
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onEdit(sector)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(sector)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
