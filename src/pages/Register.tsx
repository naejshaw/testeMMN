import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check if there's a sponsor ID in the URL (e.g. ?ref=USR-0)
    const urlParams = new URLSearchParams(window.location.search);
    const sponsorId = urlParams.get('ref') || 'USR-0'; // Defaulting to root for prototype

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, sponsorId })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Falha ao registrar');
      
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
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Nova Afiliação</h2>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', width: '100%', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.4)' }}>{error}</div>}

        <form onSubmit={handleRegister} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Nome Completo</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'white', border: '1px solid var(--card-border)', outline: 'none' }} 
            />
          </div>
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
          
          <button type="submit" style={{ marginTop: '1rem', background: 'var(--primary-purple-light)', color: 'white', padding: '0.8rem', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            Cadastrar e Entrar
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Já possui conta? <Link to="/login" style={{ color: 'var(--accent-yellow)', textDecoration: 'none', fontWeight: 600 }}>Entrar</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
