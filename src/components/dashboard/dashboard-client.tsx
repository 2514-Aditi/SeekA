"use client";

import { useApp } from "@/contexts/app-context";
import { CustomerDashboard } from "./customer-dashboard";
import { RegulatorDashboard } from "./regulator-dashboard";
import { AdminDashboard } from "./admin-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function DashboardClient() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return (
       <div className="flex items-center justify-center h-full">
         <p>Loading user data...</p>
       </div>
    );
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'customer':
      case 'guest':
        return <CustomerDashboard />;
      case 'regulator':
        return <RegulatorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Unknown user role. Cannot display dashboard.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return <div className="container py-6">{renderDashboard()}</div>;
}
