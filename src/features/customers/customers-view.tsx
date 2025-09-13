const CustomersView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl">Customer Management</h1>
          <p className="text-muted-foreground text-sm">
            View and manage customer accounts, payment history, and contact information.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Total Customers</h3>
          </div>
          <div className="font-bold text-2xl">1,247</div>
          <p className="text-muted-foreground text-xs">+8% from last month</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Active Accounts</h3>
          </div>
          <div className="font-bold text-2xl">1,108</div>
          <p className="text-muted-foreground text-xs">89% of total customers</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Outstanding Balance</h3>
          </div>
          <div className="font-bold text-2xl">$45,280</div>
          <p className="text-muted-foreground text-xs">-5% from last week</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Payment Rate</h3>
          </div>
          <div className="font-bold text-2xl">92%</div>
          <p className="text-muted-foreground text-xs">+3% improvement</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 font-semibold text-lg">Recent Customer Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Maria Rodriguez made payment</p>
              <p className="text-muted-foreground text-sm">$120.00 - Account #CR4521</p>
            </div>
            <span className="text-muted-foreground text-sm">1 hour ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">New customer registration</p>
              <p className="text-muted-foreground text-sm">Carlos Mendez - Account #CR4522</p>
            </div>
            <span className="text-muted-foreground text-sm">3 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Payment overdue alert</p>
              <p className="text-muted-foreground text-sm">Ana Santos - $85.00 due</p>
            </div>
            <span className="text-muted-foreground text-sm">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersView;
