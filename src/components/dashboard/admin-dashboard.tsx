import { AdminStats } from "./admin/admin-stats";
import { ModelSimulator } from "./admin/model-simulator";
import { BiasScanner } from "./admin/bias-scanner";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-headline tracking-tight">Admin Overview</h2>
      <AdminStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModelSimulator />
        <BiasScanner />
      </div>
    </div>
  );
}
