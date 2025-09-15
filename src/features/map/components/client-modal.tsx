import { Calendar, DollarSign, Mail, MapPin, Phone, User, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ClientLocation } from "../types";

const COORDINATE_DECIMAL_PLACES = 6;

type ClientModalProps = {
  client: ClientLocation | null;
  isOpen: boolean;
  onClose: () => void;
};

export const ClientModal = ({ client, isOpen, onClose }: ClientModalProps) => {
  if (!client) {
    return null;
  }

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Información del Cliente</DialogTitle>
          <Button
            className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={onClose}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con avatar y información básica */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage alt={client.name} src={client.avatar} />
              <AvatarFallback className="bg-primary/10 font-bold text-primary text-xl">
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-bold text-2xl">{client.name}</h3>
                <p className="text-muted-foreground">Cliente Premium</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="gap-1" variant={client.status === "active" ? "default" : "secondary"}>
                  <div
                    className={`h-2 w-2 rounded-full ${client.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  {client.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <Card>
            <CardContent className="p-6">
              <h4 className="mb-4 flex items-center gap-2 font-semibold">
                <User className="h-5 w-5 text-primary" />
                Información de Contacto
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
                    <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">Teléfono</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950">
                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">Dirección</p>
                    <p className="font-medium">{client.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <div className="grid gap-4 md:grid-cols-2">
            {client.lastContact && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950">
                      <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground text-sm">Último Contacto</p>
                      <p className="font-medium">
                        {new Date(client.lastContact).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {client.totalCollections !== undefined && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
                      <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground text-sm">Total Colecciones</p>
                      <p className="font-bold text-emerald-600 text-xl">${client.totalCollections.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coordenadas */}
          <Card>
            <CardContent className="p-4">
              <h4 className="mb-3 flex items-center gap-2 font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                Ubicación
              </h4>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <span>Latitud: {client.latitude.toFixed(COORDINATE_DECIMAL_PLACES)}</span>
                <span>Longitud: {client.longitude.toFixed(COORDINATE_DECIMAL_PLACES)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" variant="default">
              <Phone className="mr-2 h-4 w-4" />
              Llamar Cliente
            </Button>
            <Button className="flex-1" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Enviar Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
