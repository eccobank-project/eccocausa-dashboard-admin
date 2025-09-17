type CustomerStatsProps = {
  totalCustomers: number;
  activeCustomers: number;
  activePercentage: number;
  recentRecords: number;
};

export function CustomerStats({
  totalCustomers,
  activeCustomers,
  activePercentage,
  recentRecords,
}: CustomerStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="font-medium text-sm">Total Clientes</h3>
        </div>
        <div className="font-bold text-2xl">{totalCustomers.toLocaleString()}</div>
        <p className="text-muted-foreground text-xs">Clientes registrados</p>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="font-medium text-sm">Cuentas Activas</h3>
        </div>
        <div className="font-bold text-2xl">{activeCustomers.toLocaleString()}</div>
        <p className="text-muted-foreground text-xs">{activePercentage}% del total de clientes</p>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="font-medium text-sm">Últimos Registros</h3>
        </div>
        <div className="font-bold text-2xl">{recentRecords}</div>
        <p className="text-muted-foreground text-xs">Esta semana</p>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="font-medium text-sm">Tasa de Actividad</h3>
        </div>
        <div className="font-bold text-2xl">{activePercentage}%</div>
        <p className="text-muted-foreground text-xs">Clientes activos</p>
      </div>
    </div>
  );
}
