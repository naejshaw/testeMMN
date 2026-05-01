import React from 'react';
import { Link } from 'react-router-dom';
import { Network, TrendingUp, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ marginBottom: '2rem', borderBottom: 'none' }}>
        <h1 className="header-title">MMN Vision</h1>
        <div>
          <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', marginRight: '1.5rem', fontWeight: 600 }}>Entrar</Link>
          <Link to="/register" style={{ background: 'var(--primary-purple-light)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '30px', textDecoration: 'none', fontWeight: 600, boxShadow: '0 4px 15px rgba(106, 53, 221, 0.4)' }}>Começar Agora</Link>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginTop: '3rem' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', background: 'linear-gradient(90deg, #fff, var(--accent-yellow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          O Futuro das Redes Conectadas
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
          Transforme suas conexões em lucratividade. Nossa plataforma oferece gestão de rede visual, transparência de ganhos e um sistema de afiliados seguro para escalar seus resultados.
        </p>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
          <div className="reference-card" style={{ minWidth: '250px', padding: '2rem', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Network size={48} color="var(--accent-yellow)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Gestão Visual</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Navegue por toda sua rede com nosso exclusivo layout guarda-chuva.</p>
          </div>
          <div className="reference-card" style={{ minWidth: '250px', padding: '2rem', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <TrendingUp size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Ganhos em Tempo Real</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Acompanhe métricas, destaques da sua rede e rendimentos atualizados.</p>
          </div>
          <div className="reference-card" style={{ minWidth: '250px', padding: '2rem', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <ShieldCheck size={48} color="var(--primary-purple-light)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Totalmente Seguro</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Seus dados financeiros são filtrados e protegidos por nossa API impenetrável.</p>
          </div>
        </div>

        <Link to="/register" style={{ fontSize: '1.2rem', background: 'var(--accent-yellow)', color: 'var(--primary-dark)', padding: '1rem 3rem', borderRadius: '30px', textDecoration: 'none', fontWeight: 700, boxShadow: '0 10px 30px rgba(255, 203, 59, 0.3)' }}>
          Criar Minha Conta Gratuita
        </Link>
      </main>
    </div>
  );
};

export default LandingPage;
