export interface User {
  id: string;
  name: string;
  email: string;
}

export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  userId: string | null;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  date: string;
  description: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string | null;
  limit_amount: number;
  period: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  category?: Category;
  spent_amount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  is_read: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CategoryExpense {
  categoryId: string;
  categoryName: string;
  color: string;
  icon: string;
  total: number;
}

export interface MonthlyTrend {
  key: string;
  label: string;
  income: number;
  expense: number;
}
