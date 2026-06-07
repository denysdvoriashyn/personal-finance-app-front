import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Plus, 
  Trash2, 
  Search,
  X,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface TransactionsViewProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ 
  showAddModal, 
  setShowAddModal 
}) => {
  const { 
    transactions, 
    categories, 
    addTransaction, 
    deleteTransaction, 
    fetchTransactions 
  } = useFinance();

  // Фільтри
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterSearch, setFilterSearch] = useState('');

  // Поля нової транзакції
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Слідкуємо за зміною фільтрів
  useEffect(() => {
    fetchTransactions({
      type: filterType,
      categoryId: filterCategory,
      startDate: filterStartDate,
      endDate: filterEndDate,
      search: filterSearch
    });
  }, [filterType, filterCategory, filterStartDate, filterEndDate, filterSearch]);

  // При відкритті модалки скидаємо поля
  useEffect(() => {
    if (showAddModal) {
      setAmount('');
      setType('expense');
      setCategoryId('');
      setDate(new Date().toISOString().slice(0, 10));
      setDescription('');
      setError(null);
    }
  }, [showAddModal]);

  // При зміні типу транзакції у формі скидаємо обрану категорію
  useEffect(() => {
    setCategoryId('');
  }, [type]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Сума операції має бути більшою за нуль');
      return;
    }

    if (!categoryId) {
      setError('Будь ласка, оберіть категорію');
      return;
    }

    setLoading(true);
    try {
      await addTransaction({
        amount: numericAmount,
        type,
        categoryId,
        date,
        description
      });
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message || 'Не вдалося зберегти операцію');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю транзакцію?')) {
      try {
        await deleteTransaction(id);
      } catch (err: any) {
        alert(err.message || 'Не вдалося видалити транзакцію');
      }
    }
  };

  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={16} style={{ color }} />;
    }
    return <LucideIcons.HelpCircle size={16} style={{ color }} />;
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Історія транзакцій</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Керуйте своїми фінансовими операціями, додавайте витрати та надходження</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.25rem', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Додати транзакцію
        </button>
      </div>

      {/* Dynamic Filters Toolbar Panel */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          alignItems: 'end'
        }}>
          {/* Search Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Пошук за описом</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-control"
                placeholder="Сільпо..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                style={{ paddingLeft: '2.2rem', paddingRight: '0.5rem', fontSize: '0.875rem', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
              />
            </div>
          </div>

          {/* Type Select */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Тип операції</label>
            <select 
              className="form-control"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ fontSize: '0.875rem', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            >
              <option value="">Усі типи</option>
              <option value="income">Надходження (+)</option>
              <option value="expense">Витрати (-)</option>
            </select>
          </div>

          {/* Category Select */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Категорія</label>
            <select 
              className="form-control"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ fontSize: '0.875rem', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            >
              <option value="">Усі категорії</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.type === 'income' ? '📈' : '📉'} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Початок періоду</label>
            <input 
              type="date" 
              className="form-control"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              style={{ fontSize: '0.875rem', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            />
          </div>

          {/* End Date */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Кінець періоду</label>
            <input 
              type="date" 
              className="form-control"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              style={{ fontSize: '0.875rem', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            />
          </div>
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            Не знайдено жодної транзакції за обраними фільтрами.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Опис</th>
                  <th>Категорія</th>
                  <th>Тип</th>
                  <th style={{ textAlign: 'right' }}>Сума</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}>
                    {/* Date */}
                    <td>{new Date(t.date).toLocaleDateString('uk-UA')}</td>
                    
                    {/* Description */}
                    <td style={{ fontWeight: 500 }}>
                      {t.description || <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Без опису</span>}
                    </td>
                    
                    {/* Category */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          backgroundColor: t.category ? `${t.category.color}15` : 'rgba(255,255,255,0.05)',
                        }}>
                          {renderIcon(t.category?.icon || 'HelpCircle', t.category?.color || '#94a3b8')}
                        </div>
                        <span>{t.category?.name || 'Інше'}</span>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td>
                      <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {t.type === 'income' ? 'Дохід' : 'Витрата'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td style={{
                      fontWeight: 700,
                      textAlign: 'right',
                      color: t.type === 'income' ? 'var(--success)' : 'var(--text-primary)'
                    }}>
                      {t.type === 'income' ? '+' : '-'}{Number(t.amount).toFixed(2)} грн.
                    </td>

                    {/* Actions Delete button */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(t.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          transition: 'color var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
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

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Нова транзакція</h3>

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
              {/* Type toggle selection buttons */}
              <div className="form-group">
                <label className="form-label">Тип операції</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '1px solid',
                      borderColor: type === 'expense' ? 'var(--danger)' : 'var(--card-border)',
                      backgroundColor: type === 'expense' ? 'var(--danger-bg)' : 'rgba(0,0,0,0.1)',
                      color: type === 'expense' ? 'var(--danger)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-family)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <TrendingDown size={16} />
                    Витрата
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '1px solid',
                      borderColor: type === 'income' ? 'var(--success)' : 'var(--card-border)',
                      backgroundColor: type === 'income' ? 'var(--success-bg)' : 'rgba(0,0,0,0.1)',
                      color: type === 'income' ? 'var(--success)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-family)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <TrendingUp size={16} />
                    Надходження
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div className="form-group">
                <label className="form-label">Сума (UAH)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              {/* Category selector */}
              <div className="form-group">
                <label className="form-label">Категорія</label>
                <select
                  className="form-control"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">-- Оберіть категорію --</option>
                  {filteredCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date picker */}
              <div className="form-group">
                <label className="form-label">Дата операції</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Description input */}
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Опис / Коментар (необов'язково)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Купівля продуктів на тиждень..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {loading ? 'Збереження...' : 'Зберегти транзакцію'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
