"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  income: z.coerce.number().min(1),
  loanAmount: z.coerce.number().min(1),
  creditScore: z.coerce.number().min(300).max(850),
  age: z.coerce.number().min(18),
  jobType: z.enum(["salaried", "business", "freelance", "student", "unemployed"]),
  approved: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export function ModelSimulator() {
  const { addDecision, users } = useApp();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 55000,
      loanAmount: 12000,
      creditScore: 670,
      age: 45,
      jobType: "business",
      approved: true,
    },
  });

  function onSubmit(values: FormData) {
    setIsLoading(true);
    // Assign to a random customer for simulation purposes
    const customerUsers = users.filter(u => u.role === 'customer');
    const randomUser = customerUsers.length > 0
      ? customerUsers[Math.floor(Math.random() * customerUsers.length)]
      : { id: 'simulated-user', email: 'simulated@user.com' };

    addDecision({
      userId: randomUser.id,
      ...values,
    });
    
    toast({
      title: "Decision Simulated",
      description: `A new ${values.approved ? 'approved' : 'rejected'} decision has been added to the logs.`,
    });
    
    form.reset(); // Reset form for next entry
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Simulate Model Output</CardTitle>
        <CardDescription>Manually add decision records to the database for analysis.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="income" render={({ field }) => (
              <FormItem><FormLabel>Annual Income ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="loanAmount" render={({ field }) => (
              <FormItem><FormLabel>Loan Amount ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="creditScore" render={({ field }) => (
              <FormItem><FormLabel>Credit Score</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="age" render={({ field }) => (
              <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="jobType" render={({ field }) => (
              <FormItem><FormLabel>Job Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="approved" render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Loan Approved</FormLabel>
                </div>
              </FormItem>
            )} />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Simulated Decision
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
