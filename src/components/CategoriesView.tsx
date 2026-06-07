import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Plus, 
  Trash2, 
  X, 
  TrendingUp, 
  TrendingDown,
  Lock
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useFinance();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  
  // Вибір іконки
  const availableIcons = [
    'ShoppingBag', 'Car', 'Home', 'Film', 'HeartPulse', 
    'Utensils', 'Briefcase', 'Laptop', 'Coins', 'ShoppingCart', 
    'Gift', 'Trophy', 'Shield', 'Plane', 'Music', 'Book', 
    'Coffee', 'Gamepad2', 'Wine', 'Scissors', 'Wrench', 'Smartphone'
  ];
  
  const [selectedIcon, setSelectedIcon] = useState(availableIcons[0]);
  const [color, setColor] = useState('#6366f1'); // default indigo
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Скидаємо поля при відкритті модалки
  useEffect(() => {
    if (showAddModal) {
      setName('');
      setType('expense');
      setSelectedIcon(availableIcons[0]);
      setColor('#6366f1');
      setError(null);
    }
  }, [showAddModal]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Назва категорії обов\'язкова');
      return;
    }

    setLoading(true);
    try {
      await addCategory({
        name: name.trim(),
        type,
        icon: selectedIcon,
        color
      });
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message || 'Не вдалося створити категорію');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю категорію? Усі транзакції в цій категорії також буде видалено!')) {
      try {
        await deleteCategory(id);
      } catch (err: any) {
        alert(err.message || 'Не вдалося видалити категорію');
      }
    }
  };

  const renderIcon = (iconName: string, color: string, size = 18) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={size} style={{ color }} />;
    }
    return <LucideIcons.HelpCircle size={size} style={{ color }} />;
  };

  // Розділяємо на доходи та витрати
  const incomeCats = categories.filter(c => c.type === 'income');
  const expenseCats = categories.filter(c => c.type === 'expense');

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
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Категорії</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Керуйте категоріями доходів та витрат для автоматичної типізації ваших транзакцій</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.25rem', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Створити категорію
        </button>
      </div>

      {/* Grid containing Income and Expense category sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* Expenses categories section */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
            <TrendingDown size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Категорії витрат ({expenseCats.length})</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {expenseCats.map(cat => (
              <div 
                key={cat.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.015)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: `${cat.color}15`,
                    flexShrink: 0
                  }}>
                    {renderIcon(cat.icon, cat.color, 16)}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat.name}
                  </span>
                </div>

                {cat.userId === null ? (
                  <span title="Системна категорія">
                    <Lock size={12} style={{ color: 'var(--text-muted)' }} />
                  </span>
                ) : (
                  <button
                    onClick={() => handleDelete(cat.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '2px',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Income categories section */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
            <TrendingUp size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Категорії доходів ({incomeCats.length})</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {incomeCats.map(cat => (
              <div 
                key={cat.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.015)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: `${cat.color}15`,
                    flexShrink: 0
                  }}>
                    {renderIcon(cat.icon, cat.color, 16)}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat.name}
                  </span>
                </div>

                {cat.userId === null ? (
                  <span title="Системна категорія">
                    <Lock size={12} style={{ color: 'var(--text-muted)' }} />
                  </span>
                ) : (
                  <button
                    onClick={() => handleDelete(cat.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '2px',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Category Modal */}
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

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Нова категорія</h3>

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
              {/* Type Toggle buttons selection */}
              <div className="form-group">
                <label className="form-label">Тип категорії</label>
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
                    Дохід
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div className="form-group">
                <label className="form-label">Назва категорії</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Автомобіль, Освіта тощо..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Icon Selector Grid */}
              <div className="form-group">
                <label className="form-label">Виберіть іконку</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '0.5rem',
                  maxHeight: '130px',
                  overflowY: 'auto',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }}>
                  {availableIcons.map(iconName => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setSelectedIcon(iconName)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: selectedIcon === iconName ? 'var(--primary-glow)' : 'transparent',
                        outline: selectedIcon === iconName ? '1px solid var(--primary)' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {renderIcon(iconName, selectedIcon === iconName ? 'var(--primary)' : 'var(--text-secondary)', 20)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker HTML5 */}
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Виберіть колір</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{
                      border: 'none',
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent'
                    }}
                  />
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: 'monospace' }}>
                    {color.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {loading ? 'Збереження...' : 'Створити категорію'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
