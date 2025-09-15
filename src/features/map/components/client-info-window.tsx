import { Calendar, DollarSign, Mail, MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ClientLocation } from "../types";

type ClientInfoWindowProps = {
  client: ClientLocation;
  onClose: () => void;
};

export const ClientInfoWindow = ({ client, onClose }: ClientInfoWindowProps) => {
  return (
    <Card className="w-80 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage alt={client.name} src={client.avatar} />
            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {client.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">{client.name}</h3>
            <Badge className="mt-1" variant={client.status === "active" ? "default" : "secondary"}>
              {client.status}
            </Badge>
          </div>
          <button
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{client.email}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{client.phone}</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-muted-foreground">{client.address}</span>
        </div>

        {client.lastContact && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Último contacto: {new Date(client.lastContact).toLocaleDateString()}
            </span>
          </div>
        )}

        {client.totalCollections !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Total colecciones: ${client.totalCollections.toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
