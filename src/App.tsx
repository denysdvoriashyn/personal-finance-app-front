import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { Sidebar } from './components/Sidebar';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { BudgetsView } from './components/BudgetsView';
import { CategoriesView } from './components/CategoriesView';
import { Menu, Wallet } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Керування переглядами
  const [currentView, setView] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Керування модалкою транзакцій (спільний стейт для дашборду та списку транзакцій)
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
        fontSize: '1.25rem',
        fontFamily: 'var(--font-family)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.05)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Завантаження профілю...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthView />;
  }

  const handleQuickAddClick = () => {
    setView('transactions');
    setShowAddTransactionModal(true);
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            setView={setView} 
            onAddTransactionClick={handleQuickAddClick} 
          />
        );
      case 'transactions':
        return (
          <TransactionsView 
            showAddModal={showAddTransactionModal} 
            setShowAddModal={setShowAddTransactionModal} 
          />
        );
      case 'budgets':
        return <BudgetsView />;
      case 'categories':
        return <CategoriesView />;
      default:
        return <DashboardView setView={setView} onAddTransactionClick={handleQuickAddClick} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Nav */}
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      {/* Mobile Top Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--card-border)',
        display: 'none', // hidden on desktop, styled below
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        zIndex: 900
      }} className="mobile-header">
        <button 
          onClick={() => setShowMobileMenu(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <Menu size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
            color: '#fff'
          }}>
            <Wallet size={16} />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700 }}>FinanceFlow</span>
        </div>

        <div style={{ width: '32px' }} /> {/* Spacer to center the logo */}
      </header>

      {/* Main View Area */}
      <main className="main-content">
        {renderActiveView()}
      </main>

      {/* Mobile header CSS injection */}
      <style>{`
        @media (max-width: 992px) {
          .mobile-header {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </AuthProvider>
  );
};

export default App;
