import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Network, Home, LogOut, UserPlus, User } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem('mmn_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('mmn_token');
    localStorage.removeItem('mmn_user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Visão Geral', icon: <Home size={20} /> },
    { path: '/dashboard/network', label: 'Minha Rede', icon: <Network size={20} /> },
    { path: '/dashboard/referrals', label: 'Indicações', icon: <UserPlus size={20} /> },
    { path: '/dashboard/profile', label: 'Meu Perfil', icon: <User size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--primary-dark)', color: 'var(--text-main)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--card-bg)', borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', background: 'linear-gradient(90deg, #fff, var(--accent-yellow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          MMN Vision
        </h2>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', borderRadius: '8px',
                  textDecoration: 'none', color: isActive ? 'var(--accent-yellow)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(255, 203, 59, 0.1)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', color: 'var(--text-main)', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s', cursor: 'pointer' }} className="hover:bg-[rgba(255,255,255,0.05)]">
            <img src={user?.avatarUrl || 'https://i.pravatar.cc/150'} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--primary-purple-light)' }} />
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name || 'Afiliado'}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-yellow)' }}>{user?.plan || 'Plano'}</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', width: '100%', padding: '0.8rem 1rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }}
          >
            <LogOut size={20} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
