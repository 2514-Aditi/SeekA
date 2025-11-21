"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Role, User, AuditLog, Consent, AIMirror, Decision, JobType } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

interface AppContextType {
  currentUser: User | null;
  users: User[];
  auditLogs: AuditLog[];
  consents: Record<string, Consent>;
  aiMirrors: Record<string, AIMirror>;
  decisions: Decision[];
  biasScanCount: number;
  login: (email: string, pass: string) => boolean;
  loginAsGuest: () => void;
  logout: () => void;
  register: (email: string, pass: string, role: Role) => boolean;
  addLog: (action: string, details?: Record<string, any>) => void;
  getConsents: (userId: string) => Consent;
  updateConsents: (userId: string, newConsents: Partial<Consent>) => void;
  getAIMirror: (userId: string) => AIMirror;
  updateAIMirror: (userId: string, newMirror: Partial<AIMirror>) => void;
  addDecision: (decision: Omit<Decision, 'id' | 'timestamp'>) => void;
  runBiasScan: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUsers: User[] = [
  { id: 'customer-1', email: 'customer@seeka.com', password: 'password', role: 'customer' },
  { id: 'regulator-1', email: 'regulator@seeka.com', password: 'password', role: 'regulator' },
  { id: 'admin-1', email: 'admin@seeka.com', password: 'password', role: 'admin' },
];

const initialConsents: Record<string, Consent> = {
  'customer-1': { fraudDetection: true, marketing: false, creditScoring: true, personalization: true },
};

const initialAIMirrors: Record<string, AIMirror> = {
  'customer-1': { income: 75000, loanAmount: 20000, creditScore: 720, age: 35, jobType: 'salaried' },
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [consents, setConsents] = useState<Record<string, Consent>>(initialConsents);
  const [aiMirrors, setAIMirrors] = useState<Record<string, AIMirror>>(initialAIMirrors);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [biasScanCount, setBiasScanCount] = useState(0);

  const router = useRouter();
  const { toast } = useToast();

  const addLog = useCallback((action: string, details?: Record<string, any>) => {
    const logEntry: AuditLog = {
      id: generateId(),
      timestamp: new Date(),
      userId: currentUser?.id || 'system',
      userEmail: currentUser?.email || 'System',
      userRole: currentUser?.role || 'guest',
      action,
      details,
    };
    setAuditLogs(prev => [logEntry, ...prev]);
  }, [currentUser]);

  const login = (email: string, pass: string): boolean => {
    // In a real app, you'd hash the password and compare. Here we do a simple check.
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      addLog('User Login', { email: user.email, role: user.role });
      router.push('/dashboard');
      toast({ title: "Login Successful", description: `Welcome back, ${user.email}` });
      return true;
    }
    toast({ title: "Login Failed", description: "Invalid email or password.", variant: 'destructive' });
    return false;
  };

  const loginAsGuest = () => {
    const guestUser: User = { id: `guest-${generateId()}`, email: 'Guest User', role: 'guest' };
    setCurrentUser(guestUser);
     if (!consents[guestUser.id]) {
        setConsents(prev => ({ ...prev, [guestUser.id]: { fraudDetection: true, marketing: false, creditScoring: true, personalization: false } }));
    }
    if (!aiMirrors[guestUser.id]) {
        setAIMirrors(prev => ({ ...prev, [guestUser.id]: { income: 50000, loanAmount: 10000, creditScore: 650, age: 28, jobType: 'freelance' } }));
    }
    addLog('Guest Login');
    router.push('/dashboard');
    toast({ title: "Entering as Guest", description: "You are now in guest mode. Your data is temporary." });
  };
  
  const logout = () => {
    if (currentUser) {
      addLog('User Logout');
      setCurrentUser(null);
      router.push('/');
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    }
  };

  const register = (email: string, pass: string, role: Role): boolean => {
    if (users.some(u => u.email === email)) {
      toast({ title: "Registration Failed", description: "An account with this email already exists.", variant: 'destructive' });
      return false;
    }
    const newUser: User = { id: generateId(), email, password: pass, role };
    setUsers(prev => [...prev, newUser]);
    // Initialize data for new user
    setConsents(prev => ({ ...prev, [newUser.id]: { fraudDetection: true, marketing: false, creditScoring: true, personalization: false } }));
    setAIMirrors(prev => ({ ...prev, [newUser.id]: { income: 0, loanAmount: 0, creditScore: 0, age: 0, jobType: 'unemployed' } }));
    
    addLog('User Registration', { email: newUser.email, role: newUser.role });
    toast({ title: "Registration Successful", description: "Please log in with your new account." });
    return true;
  };

  const getConsents = (userId: string) => {
    return consents[userId] || { fraudDetection: false, marketing: false, creditScoring: false, personalization: false };
  };

  const updateConsents = (userId: string, newConsents: Partial<Consent>) => {
    setConsents(prev => ({ ...prev, [userId]: { ...prev[userId], ...newConsents } }));
    addLog('Consent Update', { updated: newConsents });
    toast({ title: "Consent Updated", description: "Your preferences have been saved." });
  };

  const getAIMirror = (userId: string) => {
    return aiMirrors[userId] || { income: 0, loanAmount: 0, creditScore: 0, age: 0, jobType: 'unemployed' };
  };

  const updateAIMirror = (userId: string, newMirror: Partial<AIMirror>) => {
    setAIMirrors(prev => ({ ...prev, [userId]: { ...prev[userId], ...newMirror } }));
    addLog('AI Mirror Update', { updated: newMirror });
    toast({ title: "AI Mirror Updated", description: "The AI's understanding of you has been updated." });
  };

  const addDecision = (decision: Omit<Decision, 'id' | 'timestamp'>) => {
    const newDecision: Decision = {
      ...decision,
      id: generateId(),
      timestamp: new Date(),
    };
    setDecisions(prev => [newDecision, ...prev]);
    addLog('Decision Simulated/Created', { approved: decision.approved, amount: decision.loanAmount });
  };
  
  const runBiasScan = () => {
    setBiasScanCount(prev => prev + 1);
    addLog('Bias Scan Executed');
    toast({ title: "Bias Scan Complete", description: "Fairness metrics have been recalculated." });
  }

  const value = {
    currentUser,
    users,
    auditLogs,
    consents,
    aiMirrors,
    decisions,
    biasScanCount,
    login,
    loginAsGuest,
    logout,
    register,
    addLog,
    getConsents,
    updateConsents,
    getAIMirror,
    updateAIMirror,
    addDecision,
    runBiasScan,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
