import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Transaction, Category, Budget, Notification, Summary, CategoryExpense, MonthlyTrend } from '../types';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  notifications: Notification[];
  summary: Summary | null;
  categoryExpenses: CategoryExpense[];
  monthlyTrend: MonthlyTrend[];
  loading: boolean;
  
  fetchTransactions: (filters?: any) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchBudgets: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchAnalytics: (startDate?: string, endDate?: string) => Promise<void>;
  
  addTransaction: (data: { amount: number; type: 'income' | 'expense'; categoryId: string; date: string; description?: string }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (data: { name: string; type: 'income' | 'expense'; icon: string; color: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBudget: (data: { categoryId: string | null; limit_amount: number; period: 'weekly' | 'monthly'; startDate: string; endDate: string }) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  
  const [loading, setLoading] = useState(false);

  // Отримання початкових даних при логіні
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      Promise.all([
        fetchCategories(),
        fetchBudgets(),
        fetchNotifications(),
        fetchTransactions(),
        fetchAnalytics()
      ]).finally(() => setLoading(false));
    } else {
      // Очищення стейту при логауті
      setTransactions([]);
      setCategories([]);
      setBudgets([]);
      setNotifications([]);
      setSummary(null);
      setCategoryExpenses([]);
      setMonthlyTrend([]);
    }
  }, [isAuthenticated]);

  const fetchTransactions = async (filters?: any) => {
    try {
      let query = '';
      if (filters) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key]) params.append(key, filters[key]);
        });
        query = `?${params.toString()}`;
      }
      const data = await api.get(`/transactions${query}`);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Помилка при завантаженні транзакцій:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Помилка при завантаженні категорій:', error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const data = await api.get('/budgets');
      setBudgets(data);
    } catch (error) {
      console.error('Помилка при завантаженні бюджетів:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Помилка при завантаженні сповіщень:', error);
    }
  };

  const fetchAnalytics = async (startDate?: string, endDate?: string) => {
    try {
      let query = '';
      if (startDate && endDate) {
        query = `?startDate=${startDate}&endDate=${endDate}`;
      }
      
      const [sumData, catData, trendData] = await Promise.all([
        api.get(`/analytics/summary${query}`),
        api.get(`/analytics/categories${query}`),
        api.get('/analytics/trend')
      ]);
      
      setSummary(sumData);
      setCategoryExpenses(catData);
      setMonthlyTrend(trendData);
    } catch (error) {
      console.error('Помилка при завантаженні аналітики:', error);
    }
  };

  const addTransaction = async (data: any) => {
    try {
      await api.post('/transactions', data);
      // Оновлюємо стейт після додавання
      await Promise.all([
        fetchTransactions(),
        fetchAnalytics(),
        fetchBudgets(), // Бюджети містять spent_amount, який має оновитися
        fetchNotifications() // Могло з'явитися нове сповіщення про перевищення
      ]);
    } catch (error: any) {
      throw new Error(error.message || 'Не вдалося додати транзакцію');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      await Promise.all([
        fetchTransactions(),
        fetchAnalytics(),
        fetchBudgets(),
        fetchNotifications()
      ]);
    } catch (error: any) {
      throw new Error(error.message || 'Не вдалося видалити транзакцію');
    }
  };

  const addCategory = async (data: any) => {
    try {
      await api.post('/categories', data);
      await fetchCategories();
    } catch (error: any) {
      throw new Error(error.message || 'Не вдалося створити категорію');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      await Promise.all([
        fetchCategories(),
        fetchTransactions(),
        fetchAnalytics(),
        fetchBudgets()
      ]);
    } catch (error: any) {
      throw new Error(error.message || 'Не вдалося видалити категорію');
    }
  };

  const addBudget = async (data: any) => {
    try {
      await api.post('/budgets', data);
      await Promise.all([
        fetchBudgets(),
        fetchNotifications() // Могло створитися сповіщення, якщо ліміт вже перевищено
      ]);
    } catch (error: any) {
      throw new Error(error.message || 'Не вдалося створити ліміт бюджету');
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await api.delete(`/budgets/${id}`);
      await fetchBudgets();
    } catch (error: any) {
      throw new Error(error.message || 'Не вдалося видалити бюджет');
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`, {});
      // Оновлюємо локальний стейт без повного перезавантаження
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Помилка оновлення сповіщення:', error);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.put('/notifications/read-all', {});
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Помилка оновлення сповіщень:', error);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        notifications,
        summary,
        categoryExpenses,
        monthlyTrend,
        loading,
        fetchTransactions,
        fetchCategories,
        fetchBudgets,
        fetchNotifications,
        fetchAnalytics,
        addTransaction,
        deleteTransaction,
        addCategory,
        deleteCategory,
        addBudget,
        deleteBudget,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance має використовуватися всередині FinanceProvider');
  }
  return context;
};
