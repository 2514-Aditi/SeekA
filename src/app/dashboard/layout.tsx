"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/app-context';
import { DashboardHeader } from '@/components/dashboard/header';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    // A slight delay to allow context to initialize on first load
    const timer = setTimeout(() => {
      if (!currentUser) {
        router.push('/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main>{children}</main>
    </div>
  );
}
