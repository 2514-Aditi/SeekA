"use client";

import { useApp } from "@/contexts/app-context";
import { Logo } from "../logo";
import { Button } from "../ui/button";
import { LogOut, UserCircle } from "lucide-react";
import { Badge } from "../ui/badge";

export function DashboardHeader() {
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  const getRoleBadgeVariant = (role: string) => {
    switch(role) {
      case 'admin': return 'destructive';
      case 'regulator': return 'secondary';
      case 'customer':
      case 'guest':
      default: return 'default';
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-2">
            <UserCircle className="h-5 w-5 text-muted-foreground" />
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">{currentUser.email}</span>
              <Badge variant={getRoleBadgeVariant(currentUser.role)} className="capitalize text-xs leading-tight">
                {currentUser.role}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
