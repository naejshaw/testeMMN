import React, { useState } from 'react';
import { UserPlus, Calculator, DollarSign, Users, Copy } from 'lucide-react';

const Referrals = () => {
  const user = JSON.parse(localStorage.getItem('mmn_user') || '{}');
  const referralLink = `http://localhost:5173/register?ref=${user.id}`;

  const [level1, setLevel1] = useState(10);
  const [level2Multiplier, setLevel2Multiplier] = useState(5);
  const [level3Multiplier, setLevel3Multiplier] = useState(2);
  const [level4Multiplier, setLevel4Multiplier] = useState(1);
  const [level5Multiplier, setLevel5Multiplier] = useState(1);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Link de indicação copiado!');
  };

  // Rule: L1 = 50$, L2 = 20$, L3 = 5$, L4 = 2$, L5 = 1$
  const totalL1 = level1;
  const totalL2 = level1 * level2Multiplier;
  const totalL3 = totalL2 * level3Multiplier;
  const totalL4 = totalL3 * level4Multiplier;
  const totalL5 = totalL4 * level5Multiplier;
  
  const estimatedEarnings = (totalL1 * 50) + (totalL2 * 20) + (totalL3 * 5) + (totalL4 * 2) + (totalL5 * 1);
  const totalNetworkSize = totalL1 + totalL2 + totalL3 + totalL4 + totalL5;

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Indicações e Metas</h1>

      <div className="reference-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '2rem', marginBottom: '3rem' }}>
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

      {/* Simulator */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <Calculator color="var(--accent-yellow)" />
        Simulador de Ganhos MMN
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Controls */}
        <div className="reference-card" style={{ flexDirection: 'column', padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              <span>Afiliados Diretos (Nível 1)</span>
              <span style={{ color: 'var(--accent-yellow)' }}>{level1} membros</span>
            </label>
            <input 
              type="range" min="0" max="100" value={level1} 
              onChange={e => setLevel1(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-purple-light)' }} 
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Renderão R$ 50 cada</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              <span>Convidados por Direto (Nível 2)</span>
              <span style={{ color: 'var(--accent-yellow)' }}>{level2Multiplier} por pessoa</span>
            </label>
            <input 
              type="range" min="0" max="20" value={level2Multiplier} 
              onChange={e => setLevel2Multiplier(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-purple-light)' }} 
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Total: {totalL2} membros. Renderão R$ 20 cada</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              <span>Convidados do Nível 2 (Nível 3)</span>
              <span style={{ color: 'var(--accent-yellow)' }}>{level3Multiplier} por pessoa</span>
            </label>
            <input 
              type="range" min="0" max="10" value={level3Multiplier} 
              onChange={e => setLevel3Multiplier(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-purple-light)' }} 
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Total: {totalL3} membros. Renderão R$ 5 cada</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              <span>Convidados do Nível 3 (Nível 4)</span>
              <span style={{ color: 'var(--accent-yellow)' }}>{level4Multiplier} por pessoa</span>
            </label>
            <input 
              type="range" min="0" max="5" value={level4Multiplier} 
              onChange={e => setLevel4Multiplier(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-purple-light)' }} 
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Total: {totalL4} membros. Renderão R$ 2 cada</p>
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              <span>Convidados do Nível 4 (Nível 5)</span>
              <span style={{ color: 'var(--accent-yellow)' }}>{level5Multiplier} por pessoa</span>
            </label>
            <input 
              type="range" min="0" max="5" value={level5Multiplier} 
              onChange={e => setLevel5Multiplier(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-purple-light)' }} 
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Total: {totalL5} membros. Renderão R$ 1 cada</p>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="reference-card" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--card-bg), var(--primary-purple-light))' }}>
            <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Sua Projeção de Ganhos</p>
            <h3 style={{ fontSize: '3rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={40} />
              {estimatedEarnings.toLocaleString('pt-BR')}
            </h3>
          </div>
          
          <div className="reference-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 203, 59, 0.2)', padding: '0.8rem', borderRadius: '50%' }}>
                <Users color="var(--accent-yellow)" size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tamanho Projetado da Rede</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalNetworkSize.toLocaleString('pt-BR')} membros</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
