"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { generateLoanExplanation } from "@/ai/flows/generate-loan-explanation";
import { Loader2, Lightbulb } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  income: z.coerce.number().min(1, { message: "Income must be greater than 0." }),
  loanAmount: z.coerce.number().min(1, { message: "Loan amount must be greater than 0." }),
  creditScore: z.coerce.number().min(300).max(850, { message: "Credit score must be between 300 and 850." }),
  age: z.coerce.number().min(18, { message: "You must be at least 18 years old." }),
  jobType: z.enum(["salaried", "business", "freelance", "student", "unemployed"]),
});

type FormData = z.infer<typeof formSchema>;

// Simple rule-based logic for loan approval
const isLoanApproved = (data: FormData): boolean => {
  const { income, loanAmount, creditScore } = data;
  const debtToIncomeRatio = loanAmount / income;
  
  if (creditScore < 600) return false;
  if (debtToIncomeRatio > 0.4) return false;
  if (creditScore > 700 && debtToIncomeRatio < 0.3) return true;
  
  return creditScore > 650;
};


export function AiExplanationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const { currentUser, addDecision, addLog } = useApp();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 50000,
      loanAmount: 10000,
      creditScore: 680,
      age: 30,
      jobType: "salaried",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setExplanation("");
    try {
      const result = await generateLoanExplanation(values);
      setExplanation(result.explanation);
      
      const approved = isLoanApproved(values);
      
      if (currentUser) {
        addDecision({
          userId: currentUser.id,
          ...values,
          approved,
        });
      }
      addLog('AI Explanation Generated', { input: values, approved });

      toast({
        title: "Explanation Generated",
        description: `Loan decision: ${approved ? 'Approved' : 'Rejected'}. See explanation below.`,
      });
    } catch (error) {
      console.error("Error generating explanation:", error);
      toast({
        title: "Error",
        description: "Failed to generate an explanation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI Loan Explanation</CardTitle>
        <CardDescription>Enter your details to understand the factors behind a loan decision.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="income" render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Income ($)</FormLabel>
                <FormControl><Input type="number" placeholder="50000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="loanAmount" render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Amount ($)</FormLabel>
                <FormControl><Input type="number" placeholder="10000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="creditScore" render={({ field }) => (
              <FormItem>
                <FormLabel>Credit Score</FormLabel>
                <FormControl><Input type="number" placeholder="680" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="age" render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="jobType" render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Job Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select your job type" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Explanation
            </Button>
            {(isLoading || explanation) && (
              <Card className="w-full bg-accent/50">
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p>Generating your explanation...</p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 mt-1 text-secondary" />
                      <p className="text-sm text-foreground">{explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
