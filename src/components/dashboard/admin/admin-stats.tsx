"use client";

import { useApp } from "@/contexts/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, ScanSearch } from "lucide-react";

export function AdminStats() {
  const { users, decisions, biasScanCount } = useApp();

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
    },
    {
      title: "Total Decisions Logged",
      value: decisions.length,
      icon: FileText,
    },
    {
      title: "Total Bias Scans",
      value: biasScanCount,
      icon: ScanSearch,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
