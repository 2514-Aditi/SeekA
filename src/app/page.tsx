"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useApp } from "@/contexts/app-context";
import { ArrowRight, LogIn, UserPlus, ShieldCheck, Telescope, PenSquare, Scale, BarChart2, CheckCircle } from "lucide-react";
import Image from 'next/image';

const features = [
  {
    icon: <Telescope className="h-6 w-6" />,
    title: 'AI Explanation Generator',
    description: 'Understand the "why" behind every AI-driven loan decision with clear, human-readable explanations.',
  },
  {
    icon: <PenSquare className="h-6 w-6" />,
    title: 'AI Mirror',
    description: "View the data profile our AI has of you and correct any inaccuracies to ensure fairness.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Consent Management',
    description: 'You are in control. Manage exactly how your personal data is used across different services.',
  },
  {
    icon: <Scale className="h-6 w-6" />,
    title: 'Bias & Fairness Analysis',
    description: 'For regulators, our platform provides tools to analyze decisions and identify potential biases.',
  },
];


export default function Home() {
  const { loginAsGuest } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="#features">Features</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#about">About</Link>
            </Button>
            <div className="flex items-center gap-2">
               <Button asChild variant="secondary">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">
                  <UserPlus className="mr-2 h-4 w-4" /> Register
                </Link>
              </Button>
            </div>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
              <Link href="/login">
                <LogIn />
              </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter leading-tight">
              AI in Banking, Made Transparent
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              SeekA is an ethical banking assistant that empowers you to understand AI decisions, control your data, and ensure fairness.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={loginAsGuest}>
                Explore as Guest
              </Button>
            </div>
          </div>
        </section>
        

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">A New Standard for Ethical AI</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                We provide tools for customers, regulators, and administrators to ensure accountability and transparency.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4">
                  <div className="mb-4 text-primary bg-primary/10 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-headline font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-20 bg-muted/50">
          <div className="container text-center">
             <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Experience Transparent Banking?</h2>
             <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
               Create an account or explore our features as a guest to see the future of ethical AI in finance.
             </p>
             <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Sign Up Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-8 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} SeekA. All rights reserved.</p>
            <Logo />
        </div>
      </footer>
    </div>
  );
}
