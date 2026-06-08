import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  PiggyBank, 
  Tags, 
  LogOut, 
  Wallet,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setView, 
  showMobileMenu, 
  setShowMobileMenu 
}) => {
  const { user, logout } = useAuth();
  const { notifications } = useFinance();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const menuItems = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'transactions', label: 'Транзакції', icon: ArrowRightLeft },
    { id: 'budgets', label: 'Бюджети', icon: PiggyBank },
    { id: 'categories', label: 'Категорії', icon: Tags },
    { id: 'analytics', label: 'Аналітика', icon: BarChart3 },
  ];

  const handleNavClick = (viewId: string) => {
    setView(viewId);
    setShowMobileMenu(false);
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {showMobileMenu && (
        <div 
          onClick={() => setShowMobileMenu(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: '260px',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          transform: showMobileMenu ? 'translateX(0)' : undefined,
          transition: 'transform var(--transition-normal)'
        }}
        className={showMobileMenu ? '' : 'mobile-hide'}
      >
        {/* Branding */}
        <div style={{
          padding: '2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid var(--card-border)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
            color: '#fff',
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            <Wallet size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            FinanceFlow
          </span>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '1.5rem 1rem', flex: 1 }}>
          <ul style={{ listStyle: 'none' }}>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--border-radius-sm)',
                      background: isActive ? 'var(--primary-glow)' : 'transparent',
                      border: 'none',
                      borderColor: isActive ? 'var(--primary)' : 'transparent',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-family)',
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'inherit' }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    
                    {/* Unread Alerts Badge */}
                    {item.id === 'budgets' && unreadCount > 0 && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '20px',
                        height: '20px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--danger)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0 5px'
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Info Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid var(--card-border)',
          backgroundColor: 'rgba(0,0,0,0.1)'
        }}>
          {user && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          )}

          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'transparent',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              color: 'var(--danger)',
              fontFamily: 'var(--font-family)',
              fontWeight: 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--danger-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={16} />
            Вийти
          </button>
        </div>
      </aside>

      {/* CSS injection for mobile hiding */}
      <style>{`
        @media (max-width: 992px) {
          .mobile-hide {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
};
