"use client";

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/contexts/app-context";
import { JobType } from "@/lib/types";

interface BiasData {
  jobType: string;
  approvalRate: number;
  total: number;
  approved: number;
}

export function BiasHeatmap() {
  const { decisions } = useApp();

  const biasData = React.useMemo(() => {
    const jobTypes: JobType[] = ['salaried', 'business', 'freelance', 'student', 'unemployed'];
    const decisionStats: Record<JobType, { total: number; approved: number }> = {
      salaried: { total: 0, approved: 0 },
      business: { total: 0, approved: 0 },
      freelance: { total: 0, approved: 0 },
      student: { total: 0, approved: 0 },
      unemployed: { total: 0, approved: 0 },
    };

    decisions.forEach(decision => {
      if (decisionStats[decision.jobType]) {
        decisionStats[decision.jobType].total++;
        if (decision.approved) {
          decisionStats[decision.jobType].approved++;
        }
      }
    });

    return jobTypes.map(jobType => ({
      jobType: jobType.charAt(0).toUpperCase() + jobType.slice(1),
      total: decisionStats[jobType].total,
      approved: decisionStats[jobType].approved,
      approvalRate: decisionStats[jobType].total > 0
        ? (decisionStats[jobType].approved / decisionStats[jobType].total) * 100
        : 0,
    }));
  }, [decisions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Bias Analysis by Job Type</CardTitle>
        <CardDescription>
          Approval rates based on real decisions stored in the system. This helps identify potential bias.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {decisions.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={biasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="jobType" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))"
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "approvalRate") return [`${value.toFixed(1)}%`, "Approval Rate"];
                    return [value, name];
                  }}
                />
                <Legend formatter={(value) => <span className="text-foreground capitalize">{value.replace('approvalRate', 'Approval Rate')}</span>}/>
                <Bar dataKey="approvalRate" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>No decision data available to analyze. Please simulate decisions in the Admin dashboard.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
