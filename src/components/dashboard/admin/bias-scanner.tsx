"use client";

import { useState, useMemo } from 'react';
import { useApp } from "@/contexts/app-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobType, Decision } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

interface FairnessMetrics {
  demographicParity: number | null;
  privilegedGroup: { type: JobType, rate: number };
  unprivilegedGroup: { type: JobType, rate: number };
}

export function BiasScanner() {
  const { decisions, runBiasScan, biasScanCount } = useApp();
  const [metrics, setMetrics] = useState<FairnessMetrics | null>(null);

  const handleScan = () => {
    runBiasScan();
    const calculatedMetrics = calculateFairnessMetrics(decisions);
    setMetrics(calculatedMetrics);
  };
  
  // Recalculate if decisions or the scan count changes
  const fairnessMetrics = useMemo(() => calculateFairnessMetrics(decisions), [decisions, biasScanCount]);
  
  function calculateFairnessMetrics(decisionData: Decision[]): FairnessMetrics | null {
    if (decisionData.length === 0) return null;

    const jobTypes: JobType[] = ['salaried', 'business', 'freelance', 'student', 'unemployed'];
    const rates: { type: JobType, rate: number }[] = jobTypes.map(type => {
      const groupDecisions = decisionData.filter(d => d.jobType === type);
      const approvedCount = groupDecisions.filter(d => d.approved).length;
      return {
        type,
        rate: groupDecisions.length > 0 ? approvedCount / groupDecisions.length : 0,
      };
    }).sort((a, b) => b.rate - a.rate);

    if (rates.length < 2) return null;

    const privilegedGroup = rates[0];
    const unprivilegedGroup = rates[rates.length - 1];

    const demographicParity = privilegedGroup.rate > 0 ? unprivilegedGroup.rate / privilegedGroup.rate : null;

    return {
      demographicParity,
      privilegedGroup,
      unprivilegedGroup,
    };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Bias & Fairness Scanner</CardTitle>
        <CardDescription>
          Run a scan on all stored decisions to calculate fairness metrics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {fairnessMetrics ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">Fairness Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Demographic Parity</p>
                <p className="text-3xl font-bold">
                  {fairnessMetrics.demographicParity !== null ? fairnessMetrics.demographicParity.toFixed(2) : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Ratio of unprivileged to privileged group approval rate. (Ideal: 0.8-1.2)</p>
              </div>
               <div className="border p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Privileged vs. Unprivileged</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">
                        {(fairnessMetrics.privilegedGroup.rate * 100).toFixed(0)}%
                    </p>
                    <span className="text-muted-foreground">vs</span>
                     <p className="text-3xl font-bold">
                        {(fairnessMetrics.unprivilegedGroup.rate * 100).toFixed(0)}%
                    </p>
                </div>
                 <p className="text-xs text-muted-foreground capitalize">
                   {fairnessMetrics.privilegedGroup.type} vs. {fairnessMetrics.unprivilegedGroup.type}
                 </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-4 border rounded-md">
            Not enough data to calculate fairness metrics. Add more simulated decisions.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleScan}>
          Run Bias Scan
        </Button>
      </CardFooter>
    </Card>
  );
}
