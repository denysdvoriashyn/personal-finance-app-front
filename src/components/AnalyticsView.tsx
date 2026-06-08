import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Printer, 
  Calendar,
  Percent,
  BarChart3
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { 
    summary, 
    categoryExpenses, 
    monthlyTrend, 
    fetchAnalytics 
  } = useFinance();

  // Керування періодом
  const [periodType, setPeriodType] = useState<'month' | '3months' | '6months' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Функція для встановлення дат залежно від вибраного періоду
  useEffect(() => {
    const today = new Date();
    const endStr = today.toISOString().slice(0, 10);
    let startStr = '';

    if (periodType === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      startStr = firstDay.toISOString().slice(0, 10);
      setStartDate(startStr);
      setEndDate(endStr);
      fetchAnalytics(startStr, endStr);
    } else if (periodType === '3months') {
      const past = new Date();
      past.setMonth(today.getMonth() - 2);
      past.setDate(1);
      startStr = past.toISOString().slice(0, 10);
      setStartDate(startStr);
      setEndDate(endStr);
      fetchAnalytics(startStr, endStr);
    } else if (periodType === '6months') {
      const past = new Date();
      past.setMonth(today.getMonth() - 5);
      past.setDate(1);
      startStr = past.toISOString().slice(0, 10);
      setStartDate(startStr);
      setEndDate(endStr);
      fetchAnalytics(startStr, endStr);
    } else if (periodType === 'year') {
      const past = new Date(today.getFullYear(), 0, 1);
      startStr = past.toISOString().slice(0, 10);
      setStartDate(startStr);
      setEndDate(endStr);
      fetchAnalytics(startStr, endStr);
    }
  }, [periodType]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      fetchAnalytics(startDate, endDate);
    }
  };

  // 1. Загальні розрахунки
  const totalIncome = summary?.totalIncome || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const balance = summary?.balance || 0;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  const totalExpenseSum = categoryExpenses.reduce((sum, item) => sum + item.total, 0);

  // Допоміжні розрахунки для SVG Donut Chart
  const radius = 35;
  const circumference = 2 * Math.PI * radius; // 219.9
  let currentOffset = 0;

  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={16} style={{ color }} />;
    }
    return <LucideIcons.HelpCircle size={16} style={{ color }} />;
  };

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
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Звіти та Аналітика</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Глибокий аналіз доходів, витрат та фінансової ефективності</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="btn btn-secondary no-print"
          style={{ padding: '0.6rem 1.25rem', gap: '0.5rem' }}
        >
          <Printer size={18} />
          Друкувати звіт (PDF)
        </button>
      </div>

      {/* Date / Period Filters Selector */}
      <div className="glass-card no-print" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Quick Period Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
            <button
              onClick={() => setPeriodType('month')}
              className="btn"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                backgroundColor: periodType === 'month' ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                border: '1px solid',
                borderColor: periodType === 'month' ? 'var(--primary)' : 'var(--card-border)',
                color: periodType === 'month' ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderRadius: '8px'
              }}
            >
              Цей місяць
            </button>
            <button
              onClick={() => setPeriodType('3months')}
              className="btn"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                backgroundColor: periodType === '3months' ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                border: '1px solid',
                borderColor: periodType === '3months' ? 'var(--primary)' : 'var(--card-border)',
                color: periodType === '3months' ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderRadius: '8px'
              }}
            >
              Останні 3 місяці
            </button>
            <button
              onClick={() => setPeriodType('6months')}
              className="btn"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                backgroundColor: periodType === '6months' ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                border: '1px solid',
                borderColor: periodType === '6months' ? 'var(--primary)' : 'var(--card-border)',
                color: periodType === '6months' ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderRadius: '8px'
              }}
            >
              Останні 6 місяців
            </button>
            <button
              onClick={() => setPeriodType('year')}
              className="btn"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                backgroundColor: periodType === 'year' ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                border: '1px solid',
                borderColor: periodType === 'year' ? 'var(--primary)' : 'var(--card-border)',
                color: periodType === 'year' ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderRadius: '8px'
              }}
            >
              Цей рік
            </button>
            <button
              onClick={() => setPeriodType('custom')}
              className="btn"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                backgroundColor: periodType === 'custom' ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                border: '1px solid',
                borderColor: periodType === 'custom' ? 'var(--primary)' : 'var(--card-border)',
                color: periodType === 'custom' ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderRadius: '8px'
              }}
            >
              Інший період
            </button>
          </div>

          {/* Custom Date Form */}
          {periodType === 'custom' && (
            <form onSubmit={handleCustomSubmit} style={{
              display: 'flex',
              alignItems: 'end',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Початок періоду</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  style={{ fontSize: '0.875rem', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Кінець періоду</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  style={{ fontSize: '0.875rem', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.25rem', height: '38px', fontSize: '0.875rem' }}
              >
                Показати звіт
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Date display print-only heading */}
      <div className="print-only" style={{ display: 'none', marginBottom: '1.5rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 600 }}>
          Фінансовий звіт за період: {new Date(startDate || new Date()).toLocaleDateString('uk-UA')} — {new Date(endDate || new Date()).toLocaleDateString('uk-UA')}
        </h2>
      </div>

      {/* Structured Stats Cards */}
      <div className="grid-dashboard">
        {/* Income Card */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)'
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.25rem' }}>Надходження</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
              +{totalIncome.toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>UAH</span>
            </h3>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)'
          }}>
            <TrendingDown size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.25rem' }}>Витрати</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>
              -{totalExpenses.toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>UAH</span>
            </h3>
          </div>
        </div>

        {/* Balance Card */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: balance >= 0 ? 'var(--primary-glow)' : 'var(--danger-bg)',
            color: balance >= 0 ? 'var(--primary)' : 'var(--danger)'
          }}>
            <Wallet size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.25rem' }}>Чисте заощадження</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: balance >= 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
              {balance >= 0 ? '+' : ''}{balance.toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>UAH</span>
            </h3>
          </div>
        </div>

        {/* Savings Rate Card */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            color: 'var(--info)'
          }}>
            <Percent size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.25rem' }}>Рівень заощаджень</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--info)' }}>
              {savingsRate.toFixed(1)}%
            </h3>
          </div>
        </div>
      </div>

      {/* Main Analytics Breakdown Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Expenses by Category SVG Donut and Breakdown */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            Категорії витрат
          </h3>

          {categoryExpenses.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '260px', color: 'var(--text-secondary)' }}>
              Немає витрат за вказаний період
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Donut Chart Visual */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                  <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r={radius} 
                      fill="none" 
                      stroke="rgba(255, 255, 255, 0.03)" 
                      strokeWidth="9" 
                    />
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
                          strokeWidth="9" 
                          strokeDasharray={`${strokeLength} ${circumference}`}
                          strokeDashoffset={strokeOffset}
                          transform="rotate(-90 50 50)"
                          style={{ transition: 'stroke-dasharray 0.5s ease' }}
                        />
                      );
                    })}
                  </svg>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Витрачено</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {totalExpenseSum.toFixed(0)} 
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>UAH</span>
                  </div>
                </div>
              </div>

              {/* Summary List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {categoryExpenses.map(item => {
                  const percent = totalExpenseSum > 0 ? ((item.total / totalExpenseSum) * 100).toFixed(1) : '0.0';
                  return (
                    <div key={item.categoryId} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            backgroundColor: `${item.color}15`,
                          }}>
                            {renderIcon(item.icon, item.color)}
                          </div>
                          <span style={{ fontWeight: 500 }}>{item.categoryName}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 600 }}>{item.total.toFixed(2)} грн</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({percent}%)</span>
                        </div>
                      </div>
                      
                      {/* Percent Bar indicator */}
                      <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: item.color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Category Expense Report Table */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} style={{ color: 'var(--primary)' }} />
            Звіт за категоріями
          </h3>

          <div className="table-container" style={{ flex: 1 }}>
            <table className="custom-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Категорія</th>
                  <th style={{ textAlign: 'right' }}>Сума</th>
                  <th style={{ textAlign: 'right' }}>Частка</th>
                </tr>
              </thead>
              <tbody>
                {categoryExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                      Немає транзакцій
                    </td>
                  </tr>
                ) : (
                  categoryExpenses.map(item => {
                    const percent = totalExpenseSum > 0 ? ((item.total / totalExpenseSum) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={item.categoryId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              backgroundColor: `${item.color}15`,
                            }}>
                              {renderIcon(item.icon, item.color)}
                            </div>
                            <span style={{ fontWeight: 500 }}>{item.categoryName}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          {item.total.toFixed(2)} грн
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {percent}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Monthly Trend Comparison Bar Chart */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
          Динаміка доходів та витрат
        </h3>
        
        {monthlyTrend.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: 'var(--text-secondary)' }}>
            Немає історичних даних для побудови графіка
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
            {/* Bars container */}
            <div style={{ 
              height: '200px', 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'space-between', 
              gap: '1.5rem',
              borderBottom: '1px solid var(--card-border)',
              paddingBottom: '0.5rem',
              paddingLeft: '1rem',
              paddingRight: '1rem'
            }}>
              {monthlyTrend.map(item => {
                const maxTrendVal = monthlyTrend.reduce((max, t) => Math.max(max, t.income, t.expense), 100);
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
                    
                    {/* Tooltip on hover */}
                    <div className="bar-tooltip" style={{
                      position: 'absolute',
                      bottom: '105%',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8rem',
                      display: 'none',
                      flexDirection: 'column',
                      gap: '4px',
                      zIndex: 10,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                    }}>
                      <div style={{ fontWeight: 600, borderBottom: '1px solid var(--card-border)', paddingBottom: '3px', marginBottom: '3px', color: 'var(--text-primary)' }}>{item.label}</div>
                      <div style={{ color: 'var(--success)', fontWeight: 600 }}>Надходження: +{item.income.toFixed(2)} UAH</div>
                      <div style={{ color: 'var(--danger)', fontWeight: 600 }}>Витрати: -{item.expense.toFixed(2)} UAH</div>
                    </div>

                    {/* Bars pair */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', width: '100%', height: '100%', justifyContent: 'center' }}>
                      {/* Income Bar */}
                      <div style={{ 
                        height: `${Math.max(incHeight, 3)}%`, 
                        width: '20px', 
                        backgroundColor: 'var(--success)', 
                        borderRadius: '4px 4px 0 0',
                        opacity: 0.85,
                        transition: 'height 0.5s ease'
                      }} />
                      {/* Expense Bar */}
                      <div style={{ 
                        height: `${Math.max(expHeight, 3)}%`, 
                        width: '20px', 
                        backgroundColor: 'var(--danger)', 
                        borderRadius: '4px 4px 0 0',
                        opacity: 0.85,
                        transition: 'height 0.5s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
              {monthlyTrend.map(item => (
                <span key={item.key} style={{ 
                  flex: 1, 
                  textAlign: 'center', 
                  fontSize: '0.8rem', 
                  color: 'var(--text-secondary)',
                  textTransform: 'capitalize',
                  fontWeight: 500
                }}>
                  {item.label.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .bar-group:hover .bar-tooltip {
          display: flex !important;
        }
        @media print {
          .print-only {
            display: block !important;
          }
          .bar-group .bar-tooltip {
            display: none !important;
          }
        }
      `}</style>
      
    </div>
  );
};
