import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin, Palette, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateSector, useUpdateSector } from "../hooks/use-sector-mutations";
import { SECTOR_COLORS, type Sector, type SectorFormData, type SectorFormMode } from "../types";

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

const sectorFormSchema = z.object({
  nombre: z
    .string()
    .min(MIN_NAME_LENGTH, "El nombre debe tener al menos 2 caracteres")
    .max(MAX_NAME_LENGTH, "El nombre no puede exceder 50 caracteres")
    .trim(),
  color: z.string().min(1, "Debe seleccionar un color"),
});

type SectorFormProps = {
  mode?: SectorFormMode;
  sector?: Sector;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const SectorForm = ({ mode = "create", sector, onSuccess, onCancel }: SectorFormProps) => {
  const [selectedColor, setSelectedColor] = useState(sector?.color || SECTOR_COLORS[0]);

  const createMutation = useCreateSector();
  const updateMutation = useUpdateSector();

  const form = useForm<SectorFormData>({
    resolver: zodResolver(sectorFormSchema),
    defaultValues: {
      nombre: sector?.nombre || "",
      color: sector?.color || SECTOR_COLORS[0],
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isEditing = mode === "edit";

  const onSubmit = async (data: SectorFormData) => {
    try {
      if (isEditing && sector) {
        await updateMutation.mutateAsync({
          id: sector.id,
          ...data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }

      form.reset();
      setSelectedColor(SECTOR_COLORS[0]);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCancel = () => {
    form.reset();
    setSelectedColor(sector?.color || SECTOR_COLORS[0]);
    onCancel?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {isEditing ? "Editar Sector" : "Crear Nuevo Sector"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-6 md:grid-cols-3" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Campo Nombre */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Sector</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Centro, Zona Norte..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selector de Color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color del Sector
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded-full border-2 border-border"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <Input
                          {...field}
                          className="flex-1"
                          onChange={(e) => {
                            const color = e.target.value;
                            setSelectedColor(color);
                            field.onChange(color);
                          }}
                          placeholder="#FF6B6B"
                          value={selectedColor}
                        />
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {SECTOR_COLORS.map((color) => (
                          <button
                            className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${
                              selectedColor === color ? "border-foreground ring-2 ring-ring" : "border-border"
                            }`}
                            key={color}
                            onClick={() => {
                              setSelectedColor(color);
                              field.onChange(color);
                            }}
                            style={{ backgroundColor: color }}
                            type="button"
                          />
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones de Acción */}
            <div className="flex items-end gap-2">
              <Button className="flex-1" disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Actualizando..." : "Creando..."}
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {isEditing ? "Actualizar" : "Crear Sector"}
                  </>
                )}
              </Button>

              {isEditing && (
                <Button disabled={isLoading} onClick={handleCancel} type="button" variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
