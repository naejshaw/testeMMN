import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Falha ao entrar');
      
      localStorage.setItem('mmn_token', data.token);
      localStorage.setItem('mmn_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="reference-card" style={{ flexDirection: 'column', width: '100%', maxWidth: '400px', minWidth: '0' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Acessar Painel</h2>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', width: '100%', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.4)' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'white', border: '1px solid var(--card-border)', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'white', border: '1px solid var(--card-border)', outline: 'none' }} 
            />
          </div>
          
          <button type="submit" style={{ marginTop: '1rem', background: 'var(--accent-yellow)', color: 'var(--primary-dark)', padding: '0.8rem', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            Entrar
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Ainda não tem conta? <Link to="/register" style={{ color: 'var(--accent-yellow)', textDecoration: 'none', fontWeight: 600 }}>Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
