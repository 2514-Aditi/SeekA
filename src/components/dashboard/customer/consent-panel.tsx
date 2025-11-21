"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/contexts/app-context";

export function ConsentPanel() {
  const { currentUser, getConsents, updateConsents } = useApp();
  
  if (!currentUser) return null;

  const userConsents = getConsents(currentUser.id);

  const handleConsentChange = (key: keyof typeof userConsents, checked: boolean) => {
    updateConsents(currentUser.id, { [key]: checked });
  };

  const consentItems = [
    { id: "fraudDetection", label: "Fraud Detection", description: "Allow using your data to detect and prevent fraud." },
    { id: "marketing", label: "Marketing", description: "Receive personalized marketing offers and promotions." },
    { id: "creditScoring", label: "Credit Scoring", description: "Permit data use for assessing creditworthiness." },
    { id: "personalization", label: "Personalization", description: "Enable a personalized experience within the app." },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Consent Panel</CardTitle>
        <CardDescription>Manage how your data is used. Your choices are saved instantly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {consentItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between space-x-2 p-2 rounded-lg hover:bg-accent">
            <div className="flex-1">
              <Label htmlFor={item.id} className="font-medium">{item.label}</Label>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <Switch
              id={item.id}
              checked={userConsents[item.id]}
              onCheckedChange={(checked) => handleConsentChange(item.id, checked)}
              aria-label={item.label}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
