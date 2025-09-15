import { Building2, Hash, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type ClientInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: string;
    nombre: string;
    latitud?: number;
    longitud?: number;
    lat?: number;
    lng?: number;
    sector_nombre?: string;
    [key: string]: any;
  } | null;
  isAssigned: boolean;
};

const ClientInfoModal = ({ isOpen, onClose, client, isAssigned }: ClientInfoModalProps) => {
  if (!client) return null;

  const lat = Number(client.lat || client.latitud || 0);
  const lng = Number(client.lng || client.longitud || 0);

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`h-4 w-4 rounded-full border-2 border-white shadow-sm ${
                isAssigned ? "bg-blue-500" : "bg-orange-500"
              }`}
            />
            <div>
              <DialogTitle className="font-semibold text-lg">{client.nombre}</DialogTitle>
              <DialogDescription>Información del cliente</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Estado del cliente */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700 text-sm">Estado:</span>
            <Badge
              className={`${
                isAssigned
                  ? "border-blue-200 bg-blue-100 text-blue-800"
                  : "border-orange-200 bg-orange-100 text-orange-800"
              }`}
              variant={isAssigned ? "default" : "secondary"}
            >
              <User className="mr-1 h-3 w-3" />
              {isAssigned ? "Cliente Asignado" : "Cliente No Asignado"}
            </Badge>
          </div>

          <Separator />

          {/* ID del cliente */}
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium text-gray-700 text-sm">ID</p>
              <p className="text-gray-600 text-sm">{client.id}</p>
            </div>
          </div>

          {/* Sector (si existe) */}
          {client.sector_nombre && (
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-700 text-sm">Sector</p>
                <p className="text-gray-600 text-sm">{client.sector_nombre}</p>
              </div>
            </div>
          )}

          {/* Coordenadas */}
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium text-gray-700 text-sm">Ubicación</p>
              <p className="font-mono text-gray-600 text-sm">
                {lat.toFixed(6)}, {lng.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Información adicional si existe */}
          {client.telefono && (
            <div className="flex items-center gap-3">
              <div className="flex h-4 w-4 items-center justify-center text-gray-500">📞</div>
              <div>
                <p className="font-medium text-gray-700 text-sm">Teléfono</p>
                <p className="text-gray-600 text-sm">{client.telefono}</p>
              </div>
            </div>
          )}

          {client.email && (
            <div className="flex items-center gap-3">
              <div className="flex h-4 w-4 items-center justify-center text-gray-500">✉️</div>
              <div>
                <p className="font-medium text-gray-700 text-sm">Email</p>
                <p className="text-gray-600 text-sm">{client.email}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-center">
            <button
              className="rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-200"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientInfoModal;
