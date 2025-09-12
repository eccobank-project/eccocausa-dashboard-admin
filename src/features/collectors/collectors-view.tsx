const CollectorsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl">Collectors Management</h1>
          <p className="text-muted-foreground text-sm">Manage your collection agents and track their performance.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Total Collectors</h3>
          </div>
          <div className="font-bold text-2xl">24</div>
          <p className="text-muted-foreground text-xs">+2 from last month</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Active Today</h3>
          </div>
          <div className="font-bold text-2xl">18</div>
          <p className="text-muted-foreground text-xs">75% of total collectors</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Collections Today</h3>
          </div>
          <div className="font-bold text-2xl">$12,450</div>
          <p className="text-muted-foreground text-xs">+15% from yesterday</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Average per Collector</h3>
          </div>
          <div className="font-bold text-2xl">$691</div>
          <p className="text-muted-foreground text-xs">+8% improvement</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 font-semibold text-lg">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">John Doe completed route #142</p>
              <p className="text-muted-foreground text-sm">Collected $850 from 5 customers</p>
            </div>
            <span className="text-muted-foreground text-sm">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Sarah Wilson started route #143</p>
              <p className="text-muted-foreground text-sm">8 customers assigned</p>
            </div>
            <span className="text-muted-foreground text-sm">4 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Mike Johnson finished early</p>
              <p className="text-muted-foreground text-sm">Exceeded daily target by 20%</p>
            </div>
            <span className="text-muted-foreground text-sm">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorsView;
