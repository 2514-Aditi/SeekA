export type Role = 'customer' | 'regulator' | 'admin' | 'guest';

export interface User {
  id: string;
  email: string;
  password?: string; // Not stored in context for security, but used for registration
  role: Role;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userEmail: string;
  userRole: Role;
  action: string;
  details?: Record<string, any>;
}

export interface Consent {
  fraudDetection: boolean;
  marketing: boolean;
  creditScoring: boolean;
  personalization: boolean;
}

export interface AIMirror {
  income: number;
  loanAmount: number;
  creditScore: number;
  age: number;
  jobType: string;
}

export type JobType = 'salaried' | 'business' | 'freelance' | 'student' | 'unemployed';

export interface Decision {
  id: string;
  userId: string;
  income: number;
  loanAmount: number;
  creditScore: number;
  age: number;
  jobType: JobType;
  approved: boolean;
  timestamp: Date;
}
