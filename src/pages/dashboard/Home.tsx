import React, { useEffect, useState } from 'react';
import { DollarSign, Award, ArrowUpRight, Copy } from 'lucide-react';

const Home = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const user = JSON.parse(localStorage.getItem('mmn_user') || '{}');
  const referralLink = `http://localhost:5173/register?ref=${user.id}`;

  useEffect(() => {
    fetch('http://localhost:3000/api/dashboard/metrics', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('mmn_token')}` }
    })
    .then(res => res.json())
    .then(data => setMetrics(data))
    .catch(console.error);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Link de indicação copiado!');
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Bem-vindo de volta, {user.name?.split(' ')[0]}!</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Earnings Card */}
        <div className="reference-card" style={{ minWidth: '0', padding: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Meus Ganhos</p>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={32} />
              {metrics ? metrics.personalEarnings.toLocaleString('pt-BR') : '...'}
            </h2>
          </div>
          <ArrowUpRight size={48} color="var(--success)" style={{ opacity: 0.2 }} />
        </div>

        {/* Top Performer Card */}
        <div className="reference-card" style={{ minWidth: '0', padding: '1.5rem', background: 'linear-gradient(135deg, var(--card-bg), var(--primary-purple-light))' }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--accent-yellow-light)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Destaque da sua Rede (Diretos)</p>
            {metrics?.topPerformer ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <img src={metrics.topPerformer.avatarUrl} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--accent-yellow)' }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}>{metrics.topPerformer.name}</h3>
                  <span className={`plan-badge plan-${metrics.topPerformer.plan}`}>{metrics.topPerformer.plan}</span>
                </div>
              </div>
            ) : (
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Sua rede ainda não possui afiliados ou rendimentos.</p>
            )}
          </div>
          <Award size={48} color="var(--accent-yellow)" style={{ opacity: 0.8 }} />
        </div>
      </div>

      <div className="reference-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={24} color="var(--accent-yellow)" />
          Seu Link de Indicação
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Compartilhe o link abaixo para registrar novos membros diretamente abaixo de você na rede.</p>
        
        <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
          <input 
            type="text" 
            readOnly 
            value={referralLink} 
            style={{ flex: 1, padding: '1rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'var(--text-main)', border: '1px solid var(--card-border)', outline: 'none', fontSize: '1rem' }}
          />
          <button 
            onClick={copyLink}
            style={{ background: 'var(--accent-yellow)', color: 'var(--primary-dark)', border: 'none', padding: '0 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Copy size={20} />
            Copiar
          </button>
        </div>
      </div>
    </div>
  );
};

// Temp import for the icon above since I forgot to put it in the list
import { UserPlus } from 'lucide-react';

export default Home;
