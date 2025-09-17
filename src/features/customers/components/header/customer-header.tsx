import { Button } from "@/components/ui/button";

type CustomerHeaderProps = {
  onAddCustomer: () => void;
};

export function CustomerHeader({ onAddCustomer }: CustomerHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="font-semibold text-2xl">Gestión de Clientes</h1>
        <p className="text-muted-foreground text-sm">
          Visualiza y gestiona cuentas de clientes, historial de pagos e información de contacto.
        </p>
      </div>
      <Button className="px-3" onClick={onAddCustomer}>
        Agregar Cliente
      </Button>
    </div>
  );
}
