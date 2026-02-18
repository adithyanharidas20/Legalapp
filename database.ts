
import { User, UserRole, Appointment, Case, Payment, Task } from './types';

const STORAGE_KEYS = {
  USERS: 'aa_users',
  APPOINTMENTS: 'aa_appointments',
  CASES: 'aa_cases',
  PAYMENTS: 'aa_payments',
  TASKS: 'aa_tasks',
  CURRENT_USER: 'aa_current_user'
};

const get = <T,>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const set = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial Seeding
const seedDatabase = () => {
  const users = get<User[]>(STORAGE_KEYS.USERS, []);
  let updated = false;

  // 1. Seed Admin
  if (!users.find(u => u.email === 'admin@gmail.com')) {
    const admin: User = {
      id: 'admin-1',
      name: 'Super Admin',
      email: 'admin@gmail.com',
      role: UserRole.ADMIN,
      mobile: '9999999999',
      isApproved: true
    };
    users.push(admin);
    updated = true;
  }

  // 2. Seed Sample Approved Advocates
  const sampleAdvocates: User[] = [
    {
      id: 'adv-1',
      name: 'Adv. Rajesh Kumar',
      email: 'rajesh@legal.com',
      role: UserRole.ADVOCATE,
      mobile: '9876543210',
      barCouncilNumber: 'D/1234/2010',
      barId: 'bar_id_rajesh.pdf',
      state: 'Delhi',
      court: 'Supreme Court of India',
      isApproved: true
    },
    {
      id: 'adv-2',
      name: 'Adv. Priya Sharma',
      email: 'priya@justice.com',
      role: UserRole.ADVOCATE,
      mobile: '9123456789',
      barCouncilNumber: 'MAH/5678/2015',
      barId: 'bar_id_priya.jpg',
      state: 'Maharashtra',
      court: 'Bombay High Court',
      isApproved: true
    }
  ];

  sampleAdvocates.forEach(adv => {
    if (!users.find(u => u.email === adv.email)) {
      users.push(adv);
      updated = true;
    }
  });

  // 3. Seed Sample Client
  const sampleClient: User = {
    id: 'client-1',
    name: 'Anita Singh',
    email: 'anita@example.com',
    role: UserRole.CLIENT,
    mobile: '8877665544',
    address: 'Sector 42, Gurgaon, Haryana',
    isApproved: true
  };

  if (!users.find(u => u.email === sampleClient.email)) {
    users.push(sampleClient);
    updated = true;
  }

  if (updated) {
    set(STORAGE_KEYS.USERS, users);
  }
};

seedDatabase();

export const db = {
  getUsers: () => get<User[]>(STORAGE_KEYS.USERS, []),
  saveUser: (user: User) => {
    const users = db.getUsers();
    set(STORAGE_KEYS.USERS, [...users, user]);
  },
  updateUser: (userId: string, updates: Partial<User>) => {
    const users = db.getUsers();
    set(STORAGE_KEYS.USERS, users.map(u => u.id === userId ? { ...u, ...updates } : u));
  },
  
  getAppointments: () => get<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []),
  saveAppointment: (appointment: Appointment) => {
    const apps = db.getAppointments();
    set(STORAGE_KEYS.APPOINTMENTS, [...apps, appointment]);
  },
  updateAppointment: (id: string, updates: Partial<Appointment>) => {
    const apps = db.getAppointments();
    set(STORAGE_KEYS.APPOINTMENTS, apps.map(a => a.id === id ? { ...a, ...updates } : a));
  },

  getCases: () => get<Case[]>(STORAGE_KEYS.CASES, []),
  saveCase: (c: Case) => {
    const cases = db.getCases();
    // Initialize history if new
    if (!c.history) c.history = [{ id: 'h1', actor: 'System', event: 'Case Initialized', date: new Date().toISOString() }];
    set(STORAGE_KEYS.CASES, [...cases, c]);
  },
  updateCase: (id: string, updates: Partial<Case>, actor: string = 'System') => {
    const cases = db.getCases();
    set(STORAGE_KEYS.CASES, cases.map(c => {
      if (c.id === id) {
        const newHistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          actor,
          event: updates.paymentStatus ? `Payment Status: ${updates.paymentStatus}` : updates.documents ? 'Document Uploaded' : 'Case Updated',
          date: new Date().toISOString()
        };
        return { ...c, ...updates, history: [...(c.history || []), newHistoryItem] };
      }
      return c;
    }));
  },

  getPayments: () => get<Payment[]>(STORAGE_KEYS.PAYMENTS, []),
  savePayment: (p: Payment) => {
    const payments = db.getPayments();
    set(STORAGE_KEYS.PAYMENTS, [...payments, p]);
  },

  getTasks: () => get<Task[]>(STORAGE_KEYS.TASKS, []),
  saveTask: (t: Task) => {
    const tasks = db.getTasks();
    set(STORAGE_KEYS.TASKS, [...tasks, t]);
  }
};
