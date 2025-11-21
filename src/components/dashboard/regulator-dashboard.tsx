import { AuditLogs } from "./regulator/audit-logs";
import { BiasHeatmap } from "./regulator/bias-heatmap";

export function RegulatorDashboard() {
  return (
    <div className="space-y-6">
      <BiasHeatmap />
      <AuditLogs />
    </div>
  );
}
