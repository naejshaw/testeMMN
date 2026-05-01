import React, { useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('mmn_user') || '{}'));
  
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword && newPassword !== confirmPassword) {
      return setError('A nova senha e a confirmação não coincidem.');
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mmn_token')}`
        },
        body: JSON.stringify({
          name, email, avatarUrl, currentPassword, newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar perfil');

      localStorage.setItem('mmn_token', data.token);
      localStorage.setItem('mmn_user', JSON.stringify(data.user));
      setUser(data.user);
      setMessage(data.message);
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Meu Perfil</h1>

      <div className="reference-card" style={{ padding: '2rem', flexDirection: 'column' }}>
        
        {message && <div style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#86efac', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(34, 197, 94, 0.4)' }}>{message}</div>}
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.4)' }}>{error}</div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--card-border)' }}>
          <img src={avatarUrl || 'https://i.pravatar.cc/150'} alt="Avatar Preview" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--primary-purple-light)' }} />
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>{user.name}</h2>
            <p style={{ color: 'var(--accent-yellow)', marginTop: '0.2rem' }}>{user.plan}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Personal Data Section */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Dados Pessoais</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Nome Completo</label>
                <input 
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'white', border: '1px solid var(--card-border)', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Email</label>
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'white', border: '1px solid var(--card-border)', outline: 'none' }} 
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>URL da Foto de Perfil</label>
                <input 
                  type="url" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://exemplo.com/minha-foto.jpg"
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'white', border: '1px solid var(--card-border)', outline: 'none' }} 
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Segurança</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Para alterar sua senha, preencha os campos abaixo. Deixe em branco caso não queira alterar.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Senha Atual</label>
                <input 
                  type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', maxWidth: '300px', padding: '0.8rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'white', border: '1px solid var(--card-border)', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Nova Senha</label>
                <input 
                  type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'white', border: '1px solid var(--card-border)', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Confirmar Nova Senha</label>
                <input 
                  type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'white', border: '1px solid var(--card-border)', outline: 'none' }} 
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ background: 'var(--accent-yellow)', color: 'var(--primary-dark)', padding: '0.8rem 2.5rem', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
              Salvar Alterações
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;
