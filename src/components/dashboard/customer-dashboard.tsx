import { AiExplanationForm } from "./customer/ai-explanation-form";
import { AiMirror } from "./customer/ai-mirror";
import { ConsentPanel } from "./customer/consent-panel";

export function CustomerDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <AiExplanationForm />
      </div>
      <div className="space-y-6">
        <AiMirror />
        <ConsentPanel />
      </div>
    </div>
  );
}
