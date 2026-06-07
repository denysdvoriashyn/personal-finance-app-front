import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertTriangle,
  Plus
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface DashboardViewProps {
  setView: (view: string) => void;
  onAddTransactionClick: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  setView, 
  onAddTransactionClick 
}) => {
  const { 
    transactions, 
    summary, 
    categoryExpenses, 
    monthlyTrend, 
    notifications,
    markNotificationRead
  } = useFinance();

  const activeAlerts = notifications.filter(n => !n.is_read);

  // 1. Обчислення значень для кругової діаграми (Category Expenses)
  const totalExpenseSum = categoryExpenses.reduce((sum, item) => sum + item.total, 0);
  
  // Допоміжні розрахунки для SVG Donut Chart
  const radius = 30;
  const circumference = 2 * Math.PI * radius; // 188.49
  let currentOffset = 0;

  // Функція для отримання іконки динамічно
  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={16} style={{ color }} />;
    }
    return <LucideIcons.HelpCircle size={16} style={{ color }} />;
  };

  // 2. Обчислення даних для графіка трендів (Monthly Trend)
  const maxTrendVal = monthlyTrend.reduce((max, item) => {
    return Math.max(max, item.income, item.expense);
  }, 100); // Базовий максимум 100, щоб не ділити на 0

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Огляд фінансів</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Аналітика та контроль вашого бюджету в реальному часі</p>
        </div>
        <button 
          onClick={onAddTransactionClick}
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.25rem', gap: '0.5rem', borderRadius: 'var(--border-radius-sm)' }}
        >
          <Plus size={18} />
          Додати транзакцію
        </button>
      </div>

      {/* Unread Budget Alerts Notification Section */}
      {activeAlerts.length > 0 && (
        <div 
          className="pulse-warning"
          style={{
            background: 'var(--danger-bg)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontWeight: 600, fontSize: '0.95rem' }}>
            <AlertTriangle size={18} />
            Попередження про перевищення лімітів ({activeAlerts.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activeAlerts.slice(0, 2).map(alert => (
              <div key={alert.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                fontSize: '0.875rem',
                backgroundColor: 'rgba(0,0,0,0.15)',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>{alert.message}</span>
                <button 
                  onClick={() => markNotificationRead(alert.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textDecoration: 'underline'
                  }}
                >
                  Читати
                </button>
              </div>
            ))}
            {activeAlerts.length > 2 && (
              <button 
                onClick={() => setView('budgets')}
                style={{
                  alignSelf: 'flex-start',
                  background: 'none',
                  border: 'none',
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                Показати всі попередження...
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Widgets Cards */}
      <div className="grid-dashboard">
        {/* Total Balance Widget */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(18, 20, 28, 0.7) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '160px'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Загальний баланс</span>
              <Wallet size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, fontFamily: 'var(--font-family)', wordBreak: 'break-all' }}>
              {summary ? (summary.balance).toFixed(2) : '0.00'} <span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-secondary)' }}>UAH</span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>Поточний місяць</span>
          </div>
        </div>

        {/* Total Income Widget */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Надходження</span>
              <div style={{ padding: '4px', borderRadius: '50%', backgroundColor: 'var(--success-bg)' }}>
                <TrendingUp size={16} style={{ color: 'var(--success)' }} />
              </div>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
              +{summary ? (summary.totalIncome).toFixed(2) : '0.00'} <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>UAH</span>
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--success)' }}>
            <ArrowUpRight size={16} />
            <span>За період</span>
          </div>
        </div>

        {/* Total Expenses Widget */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Витрати</span>
              <div style={{ padding: '4px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)' }}>
                <TrendingDown size={16} style={{ color: 'var(--danger)' }} />
              </div>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>
              -{summary ? (summary.totalExpenses).toFixed(2) : '0.00'} <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>UAH</span>
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--danger)' }}>
            <ArrowDownRight size={16} />
            <span>За період</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Category Expenses Distribution Donut */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Розподіл витрат</h3>
          
          {categoryExpenses.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: 'var(--text-secondary)' }}>
              Немає витрат для аналізу
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
              
              {/* Custom SVG Donut Chart */}
              <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  {/* Background Circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r={radius} 
                    fill="none" 
                    stroke="rgba(255, 255, 255, 0.03)" 
                    strokeWidth="8" 
                  />
                  {/* Slices mapping */}
                  {categoryExpenses.map((item) => {
                    const percent = item.total / totalExpenseSum;
                    const strokeLength = percent * circumference;
                    const strokeOffset = circumference - strokeLength + currentOffset;
                    currentOffset -= strokeLength;
                    
                    return (
                      <circle 
                        key={item.categoryId}
                        cx="50" 
                        cy="50" 
                        r={radius} 
                        fill="none" 
                        stroke={item.color} 
                        strokeWidth="8" 
                        strokeDasharray={`${strokeLength} ${circumference}`}
                        strokeDashoffset={strokeOffset}
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dasharray 0.5s ease' }}
                      />
                    );
                  })}
                </svg>
                {/* Center text displaying total sum */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Всього витрачено</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {totalExpenseSum.toFixed(0)} 
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>UAH</span>
                </div>
              </div>

              {/* Chart Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '140px' }}>
                {categoryExpenses.slice(0, 5).map((item) => {
                  const percent = ((item.total / totalExpenseSum) * 100).toFixed(0);
                  return (
                    <div key={item.categoryId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', marginRight: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.categoryName}</span>
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{percent}%</span>
                    </div>
                  );
                })}
                {categoryExpenses.length > 5 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                    Та ще {categoryExpenses.length - 5} категорій
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic SVG Bar Chart for Monthly Trends */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Тренд доходів та витрат</h3>
          
          {monthlyTrend.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: 'var(--text-secondary)' }}>
              Немає історичних даних
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
              {/* Bars area */}
              <div style={{ 
                height: '160px', 
                display: 'flex', 
                alignItems: 'flex-end', 
                justifyContent: 'space-between', 
                gap: '1rem',
                borderBottom: '1px solid var(--card-border)',
                paddingBottom: '0.5rem',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem'
              }}>
                {monthlyTrend.map(item => {
                  // Висота стовпчиків у відсотках
                  const incHeight = (item.income / maxTrendVal) * 100;
                  const expHeight = (item.expense / maxTrendVal) * 100;

                  return (
                    <div key={item.key} style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      height: '100%',
                      justifyContent: 'flex-end',
                      position: 'relative'
                    }} className="bar-group">
                      
                      {/* Interactive Tooltip on hover */}
                      <div className="bar-tooltip" style={{
                        position: 'absolute',
                        bottom: '105%',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '6px',
                        padding: '0.4rem 0.6rem',
                        fontSize: '0.75rem',
                        display: 'none',
                        flexDirection: 'column',
                        gap: '2px',
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                      }}>
                        <div style={{ color: 'var(--success)', fontWeight: 600 }}>+{item.income.toFixed(0)} UAH</div>
                        <div style={{ color: 'var(--danger)', fontWeight: 600 }}>-{item.expense.toFixed(0)} UAH</div>
                      </div>

                      {/* Stacked pair of bars */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', width: '100%', height: '100%', justifyContent: 'center' }}>
                        {/* Income Bar */}
                        <div style={{ 
                          height: `${Math.max(incHeight, 2)}%`, 
                          width: '12px', 
                          backgroundColor: 'var(--success)', 
                          borderRadius: '3px 3px 0 0',
                          opacity: 0.85,
                          transition: 'height 0.5s ease'
                        }} />
                        {/* Expense Bar */}
                        <div style={{ 
                          height: `${Math.max(expHeight, 2)}%`, 
                          width: '12px', 
                          backgroundColor: 'var(--danger)', 
                          borderRadius: '3px 3px 0 0',
                          opacity: 0.85,
                          transition: 'height 0.5s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Monthly Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                {monthlyTrend.map(item => {
                  // Половина назви місяця (наприклад, "Червень 2026" -> "Черв")
                  const shortMonth = item.label.split(' ')[0].slice(0, 3);
                  return (
                    <span key={item.key} style={{ 
                      flex: 1, 
                      textAlign: 'center', 
                      fontSize: '0.75rem', 
                      color: 'var(--text-secondary)',
                      textTransform: 'capitalize'
                    }}>
                      {shortMonth}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Останні транзакції</h3>
          <button 
            onClick={() => setView('transactions')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'underline'
            }}
          >
            Всі операції
          </button>
        </div>

        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
            Транзакцій поки немає. Додайте першу операцію!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {transactions.slice(0, 5).map(t => (
              <div 
                key={t.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.03)'
                }}
              >
                {/* Left side: Icon & Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: t.category ? `${t.category.color}15` : 'rgba(255,255,255,0.05)',
                    flexShrink: 0
                  }}>
                    {renderIcon(t.category?.icon || 'HelpCircle', t.category?.color || '#94a3b8')}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.description || t.category?.name || 'Без назви'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(t.date).toLocaleDateString('uk-UA')} • {t.category?.name || 'Без категорії'}
                    </div>
                  </div>
                </div>

                {/* Right side: Amount and Type */}
                <div style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: t.type === 'income' ? 'var(--success)' : 'var(--text-primary)',
                  textAlign: 'right',
                  flexShrink: 0
                }}>
                  {t.type === 'income' ? '+' : '-'}{Number(t.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .bar-group:hover .bar-tooltip {
          display: flex !important;
        }
      `}</style>

    </div>
  );
};
