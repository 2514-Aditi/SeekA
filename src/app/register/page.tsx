import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="font-headline">Create an Account</CardTitle>
            <CardDescription>Join SeekA to experience transparent banking.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" asChild className="p-0">
                <Link href="/login">
                  Log in here
                </Link>
              </Button>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
