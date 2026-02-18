
export enum UserRole {
  ADMIN = 'admin',
  ADVOCATE = 'advocate',
  CLIENT = 'client',
  JUNIOR = 'junior'
}

export enum AppointmentStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum PaymentStatus {
  UNPAID = 'Unpaid',
  PARTIALLY_PAID = 'Partially Paid',
  PAID = 'Paid'
}

export interface CaseHistoryItem {
  id: string;
  event: string;
  date: string;
  actor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mobile: string;
  address?: string;
  barCouncilNumber?: string;
  barId?: string; // Stores filename or data
  aadhaar?: string;
  state?: string;
  court?: string;
  isApproved?: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  advocateId: string;
  date: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  category: string;
  advocateId: string;
  clientId: string;
  feeAmount: number;
  paymentStatus: PaymentStatus;
  documents: { name: string; date: string; type: string }[];
  history: CaseHistoryItem[];
  createdAt: string;
}

export interface Payment {
  id: string;
  caseId: string;
  clientId: string;
  advocateId: string;
  amount: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: 'Pending' | 'Success' | 'Failed';
  createdAt: string;
}

export interface Task {
  id: string;
  caseId: string;
  juniorId: string;
  title: string;
  deadline: string;
  status: 'To Do' | 'In Progress' | 'Completed';
}
