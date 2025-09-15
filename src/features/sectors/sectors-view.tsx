import { AlertCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectorForm } from "./components/sector-form";
import { SectorsMap } from "./components/sectors-map";
import { SectorsTable } from "./components/sectors-table";
import { useSectorList } from "./hooks/use-sector-list";
import type { Sector } from "./types";

const COLORS_PREVIEW_LIMIT = 5;

// Helper functions para evitar ternarios anidados
const getFormTabTitle = (showCreateForm: boolean, editingSector: Sector | null): string => {
  if (showCreateForm) {
    return "Crear Sector";
  }
  if (editingSector) {
    return "Editar Sector";
  }
  return "Formulario";
};

const getFormCardTitle = (showCreateForm: boolean, editingSector: Sector | null): string => {
  if (showCreateForm) {
    return "Crear Nuevo Sector";
  }
  if (editingSector) {
    return "Editar Sector";
  }
  return "Formulario de Sector";
};

const getFormCardDescription = (showCreateForm: boolean, editingSector: Sector | null): string => {
  if (showCreateForm) {
    return "Completa la información del nuevo sector";
  }
  if (editingSector) {
    return "Modifica la información del sector seleccionado";
  }
  return "Utiliza el mapa para buscar un sector o haz clic en 'Nuevo Sector'";
};

const SectorsView = () => {
  const { data: sectors, isLoading, error } = useSectorList();

  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState("table");

  const handleSectorSelect = (sector: Sector) => {
    // Solo cambiar a la pestaña de mapa para visualizar
    setActiveTab("map");
    console.log("Sector seleccionado:", sector.nombre);
  };

  const handleEditSector = (sector: Sector) => {
    setEditingSector(sector);
    setShowCreateForm(false);
    setActiveTab("form");
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingSector(null);
    setActiveTab("table");
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
    setEditingSector(null);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error al cargar los sectores: {error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Gestión de Sectores</h1>
          <p className="text-muted-foreground">Administra los sectores de la ciudad y visualízalos en el mapa</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setShowCreateForm(true);
            setEditingSector(null);
            setActiveTab("form");
          }}
        >
          <Plus className="h-4 w-4" />
          Nuevo Sector
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Sectores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{sectors?.length ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Sectores Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{sectors?.length ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Último Creado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">
              {sectors?.[0]?.created_at ? new Date(sectors[0].created_at).toLocaleDateString("es-ES") : "Sin datos"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Colores Usados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1">
              {Array.from(new Set((sectors ?? []).map((s: Sector) => s.color)))
                .slice(0, COLORS_PREVIEW_LIMIT)
                .map((color) => (
                  <div
                    className="h-4 w-4 rounded-full border border-border"
                    key={color}
                    style={{ backgroundColor: color as string }}
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="table">Lista de Sectores</TabsTrigger>
          <TabsTrigger value="map">Mapa de Sectores</TabsTrigger>
          <TabsTrigger value="form">{getFormTabTitle(showCreateForm, editingSector)}</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="table">
          <Card>
            <CardHeader>
              <CardTitle>Sectores Registrados</CardTitle>
              <CardDescription>Lista completa de sectores con opciones de edición y eliminación</CardDescription>
            </CardHeader>
            <CardContent>
              <SectorsTable
                data={sectors}
                isLoading={isLoading}
                onEdit={handleEditSector}
                onMapView={handleSectorSelect}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="map">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Sectores</CardTitle>
              <CardDescription>
                Visualiza clientes asignados y no asignados en el mapa. Utiliza los filtros para mostrar diferentes
                tipos de clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: activeTab === "map" ? "block" : "none" }}>
                <SectorsMap />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="form">
          <Card>
            <CardHeader>
              <CardTitle>{getFormCardTitle(showCreateForm, editingSector)}</CardTitle>
              <CardDescription>{getFormCardDescription(showCreateForm, editingSector)}</CardDescription>
            </CardHeader>
            <CardContent>
              <SectorForm
                mode={editingSector ? "edit" : "create"}
                onCancel={handleFormCancel}
                onSuccess={handleFormSuccess}
                sector={editingSector || undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { SectorsView };
