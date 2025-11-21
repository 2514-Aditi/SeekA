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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useApp } from "@/contexts/app-context";
import { updateAiMirror } from "@/ai/flows/update-ai-mirror";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Edit } from "lucide-react";

const formSchema = z.object({
  income: z.coerce.number().min(0, "Income cannot be negative."),
  loanAmount: z.coerce.number().min(0, "Loan amount cannot be negative."),
  creditScore: z.coerce.number().min(300).max(850),
  age: z.coerce.number().min(18),
  jobType: z.enum(["salaried", "business", "freelance", "student", "unemployed"]),
});

type FormData = z.infer<typeof formSchema>;

export function AiMirror() {
  const { currentUser, getAIMirror, updateAIMirror: updateContextMirror } = useApp();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mirrorData = currentUser ? getAIMirror(currentUser.id) : null;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: mirrorData || undefined,
  });

  async function onSubmit(values: FormData) {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      await updateAiMirror(values);
      updateContextMirror(currentUser.id, values);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating AI Mirror:", error);
      toast({
        title: "Error",
        description: "Failed to update your AI Mirror. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!mirrorData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Mirror</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading AI Mirror data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI Mirror</CardTitle>
        <CardDescription>This is what our AI understands about you. You can correct it if it's wrong.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="font-medium text-muted-foreground">Income</div>
          <div>${mirrorData.income.toLocaleString()}</div>
          <div className="font-medium text-muted-foreground">Recent Loan Inquiry</div>
          <div>${mirrorData.loanAmount.toLocaleString()}</div>
          <div className="font-medium text-muted-foreground">Est. Credit Score</div>
          <div>{mirrorData.creditScore}</div>
          <div className="font-medium text-muted-foreground">Age</div>
          <div>{mirrorData.age}</div>
          <div className="font-medium text-muted-foreground">Job Type</div>
          <div className="capitalize">{mirrorData.jobType}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit AI Mirror
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit AI Mirror</DialogTitle>
              <DialogDescription>
                Update the values below to correct the AI's understanding of your profile.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField control={form.control} name="income" render={({ field }) => (
                  <FormItem><FormLabel>Annual Income</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="loanAmount" render={({ field }) => (
                  <FormItem><FormLabel>Loan Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
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
                    </Select>
                  <FormMessage /></FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
