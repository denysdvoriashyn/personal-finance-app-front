import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, Key, Mail, User, ArrowRight } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLogin && password.length < 6) {
      setError('Пароль має містити не менше 6 символів');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Сталася помилка при авторизації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%)',
      backgroundColor: 'var(--bg-primary)',
      padding: '1.5rem'
    }}>
      <div className="glass-card animate-slide-up" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2.5rem 2rem',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
      }}>
        
        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: 'var(--border-radius-md)',
            background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
            color: '#fff',
            marginBottom: '1rem',
            boxShadow: '0 8px 24px var(--primary-glow)'
          }}>
            <Wallet size={30} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {isLogin ? 'Вхід до кабінету' : 'Реєстрація профілю'}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {isLogin 
              ? 'Керуйте своїми фінансами розумно' 
              : 'Створіть акаунт для автоматичного обліку доходів та витрат'}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.2s ease'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Ваше ім'я</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Олександр"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ paddingLeft: '2.8rem' }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Електронна пошта</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="email"
                className="form-control"
                placeholder="mail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.8rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Пароль</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.8rem' }}
              />
            </div>
            {!isLogin && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'block' }}>
                * Пароль має містити не менше 6 символів
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', gap: '0.75rem' }}
          >
            {loading ? 'Завантаження...' : isLogin ? 'Увійти' : 'Зареєструватися'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          {isLogin ? 'Ще немає акаунта?' : 'Вже зареєстровані?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Створити акаунт' : 'Увійти в кабінет'}
          </button>
        </div>
      </div>
    </div>
  );
};
