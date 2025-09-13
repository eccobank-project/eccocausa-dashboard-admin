const MapView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl">Map View</h1>
          <p className="text-muted-foreground text-sm">Track collectors and customers on the interactive map.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Active Routes</h3>
          </div>
          <div className="font-bold text-2xl">12</div>
          <p className="text-muted-foreground text-xs">Routes in progress</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Collectors Online</h3>
          </div>
          <div className="font-bold text-2xl">18</div>
          <p className="text-muted-foreground text-xs">Currently tracking</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Areas Covered</h3>
          </div>
          <div className="font-bold text-2xl">8</div>
          <p className="text-muted-foreground text-xs">Service zones active</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Completed Today</h3>
          </div>
          <div className="font-bold text-2xl">67</div>
          <p className="text-muted-foreground text-xs">Collections finished</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 font-semibold text-lg">Interactive Map</h3>
        <div className="flex h-96 items-center justify-center rounded-lg bg-muted">
          <div className="text-center">
            <div className="mb-2 text-4xl">🗺️</div>
            <p className="font-medium text-lg">Map Component</p>
            <p className="text-muted-foreground text-sm">Interactive map will be implemented here</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 font-semibold text-lg">Live Updates</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">John Doe arrived at location</p>
              <p className="text-muted-foreground text-sm">Zona Norte - Customer #4521</p>
            </div>
            <span className="text-muted-foreground text-sm">2 min ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Route #143 completed</p>
              <p className="text-muted-foreground text-sm">Sarah Wilson - 8 customers visited</p>
            </div>
            <span className="text-muted-foreground text-sm">15 min ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">New route assigned</p>
              <p className="text-muted-foreground text-sm">Mike Johnson - Zona Centro</p>
            </div>
            <span className="text-muted-foreground text-sm">28 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
