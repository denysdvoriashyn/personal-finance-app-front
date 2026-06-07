import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Calendar, 
  X, 
  Info
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const BudgetsView: React.FC = () => {
  const { 
    budgets, 
    categories, 
    addBudget, 
    deleteBudget 
  } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryId, setCategoryId] = useState<string>(''); // empty string means total/general limit
  const [limitAmount, setLimitAmount] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
  
  // Дати за замовчуванням на поточний місяць
  const getDates = () => {
    const start = new Date();
    start.setDate(1); // Початок місяця
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // Кінець місяця
    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10)
    };
  };

  const [startDate, setStartDate] = useState(getDates().start);
  const [endDate, setEndDate] = useState(getDates().end);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // При відкритті модалки скидаємо поля
  useEffect(() => {
    if (showAddModal) {
      setCategoryId('');
      setLimitAmount('');
      setPeriod('monthly');
      const dates = getDates();
      setStartDate(dates.start);
      setEndDate(dates.end);
      setError(null);
    }
  }, [showAddModal]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericLimit = parseFloat(limitAmount);
    if (isNaN(numericLimit) || numericLimit <= 0) {
      setError('Сума ліміту має бути більшою за нуль');
      return;
    }

    setLoading(true);
    try {
      await addBudget({
        categoryId: categoryId === '' ? null : categoryId,
        limit_amount: numericLimit,
        period,
        startDate,
        endDate
      });
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message || 'Не вдалося створити ліміт бюджету');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей ліміт бюджету?')) {
      try {
        await deleteBudget(id);
      } catch (err: any) {
        alert(err.message || 'Не вдалося видалити бюджет');
      }
    }
  };

  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={18} style={{ color }} />;
    }
    return <LucideIcons.HelpCircle size={18} style={{ color }} />;
  };

  // Фільтруємо категорії тільки для витрат
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Ліміти бюджетів</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Контролюйте та обмежуйте свої витрати за категоріями</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.25rem', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Встановити ліміт
        </button>
      </div>

      {/* Info Card banner */}
      <div className="glass-card" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        border: '1px dashed var(--primary-hover)',
        padding: '1rem'
      }}>
        <Info size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Система автоматично сповістить вас, якщо витрати за певною категорією перевищать встановлений тут ліміт. Витрати розраховуються динамічно на основі ваших транзакцій у вказаному діапазоні дат.
        </p>
      </div>

      {/* Budgets Progress List */}
      {budgets.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          Ви ще не встановили жодного ліміту бюджету. Створіть перший ліміт, щоб розпочати контроль!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {budgets.map(budget => {
            const spent = budget.spent_amount || 0;
            const limit = budget.limit_amount;
            const percent = Math.min(Math.round((spent / limit) * 100), 200); // Обмежуємо 200% для візуалу смужки
            const isExceeded = spent > limit;
            
            // Визначаємо колір смужки
            let progressColor = 'var(--success)';
            if (percent >= 70 && percent < 90) {
              progressColor = 'var(--warning)';
            } else if (percent >= 90) {
              progressColor = 'var(--danger)';
            }

            return (
              <div 
                key={budget.id} 
                className={`glass-card ${isExceeded ? 'pulse-warning' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  position: 'relative'
                }}
              >
                {/* Delete button top right */}
                <button
                  onClick={() => handleDelete(budget.id)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={16} />
                </button>

                {/* Category Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingRight: '2rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: budget.category ? `${budget.category.color}15` : 'rgba(99, 102, 241, 0.15)',
                  }}>
                    {renderIcon(budget.category?.icon || 'PiggyBank', budget.category?.color || 'var(--primary)')}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                      {budget.category ? budget.category.name : 'Загальний ліміт'}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '2px' }}>
                      <Calendar size={12} />
                      {new Date(budget.startDate).toLocaleDateString('uk-UA')} - {new Date(budget.endDate).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                </div>

                {/* Progress calculation info values */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Витрачено</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      {spent.toFixed(2)} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>з {limit.toFixed(2)} грн</span>
                    </span>
                  </div>

                  {/* Progress Bar Background */}
                  <div style={{
                    height: '8px',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {/* Progress Bar Fill */}
                    <div style={{
                      height: '100%',
                      width: `${Math.min(percent, 100)}%`,
                      backgroundColor: progressColor,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease-out'
                    }} />
                  </div>
                </div>

                {/* Status Indicator alert */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ color: progressColor }}>
                    Використано {Math.round((spent / limit) * 100)}%
                  </span>
                  {isExceeded && (
                    <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <AlertTriangle size={14} />
                      Перевищено на {(spent - limit).toFixed(2)} грн
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Budget Limit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card animate-slide-up" style={{
            width: '100%',
            maxWidth: '460px',
            position: 'relative',
            padding: '2rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Встановити новий ліміт</h3>

            {error && (
              <div style={{
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.875rem',
                marginBottom: '1.25rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleAddSubmit}>
              {/* Category selection */}
              <div className="form-group">
                <label className="form-label">Категорія витрат</label>
                <select
                  className="form-control"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Загальний ліміт (на всі витрати разом)</option>
                  {expenseCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Limit amount */}
              <div className="form-group">
                <label className="form-label">Сума ліміту (UAH)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  required
                />
              </div>

              {/* Period selection */}
              <div className="form-group">
                <label className="form-label">Період контролю</label>
                <select
                  className="form-control"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as any)}
                >
                  <option value="monthly">Щомісячно</option>
                  <option value="weekly">Щотижнево</option>
                </select>
              </div>

              {/* Date pickers start/end */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Початок періоду</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Кінець періоду</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
              >
                {loading ? 'Збереження...' : 'Створити бюджетний ліміт'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
