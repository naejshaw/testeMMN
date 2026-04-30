import React, { useState, useCallback, useEffect } from 'react';
import type { UserNode } from './services/api';
import { fetchUserNetwork } from './services/api';
import { NetworkView } from './components/NetworkView';
import { ChevronRight, Home, Loader2, AlertTriangle } from 'lucide-react';
import './index.css';

// We store minimal breadcrumb navigation to avoid stale data
interface PathNode {
  id: string;
  name: string;
}

function App() {
  const [navigationPath, setNavigationPath] = useState<PathNode[]>([{ id: 'USR-0', name: 'Rede Principal' }]);
  const [currentNetwork, setCurrentNetwork] = useState<UserNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentReferenceId = navigationPath[navigationPath.length - 1].id;
  const currentLevel = navigationPath.length - 1;

  useEffect(() => {
    let active = true;
    
    async function loadNetwork() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchUserNetwork(currentReferenceId);
        if (active) {
          setCurrentNetwork(data);
          
          // Optionally update the breadcrumb name if we only had the ID
          setNavigationPath((prev) => {
            const newPath = [...prev];
            newPath[newPath.length - 1].name = data.name;
            return newPath;
          });
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Falha ao conectar com o servidor');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadNetwork();

    return () => {
      active = false;
    };
  }, [currentReferenceId]);

  const handleDrillDown = useCallback((user: UserNode) => {
    setNavigationPath(prev => [...prev, { id: user.id, name: user.name }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBreadcrumbClick = useCallback((index: number) => {
    if (index === navigationPath.length - 1) return;
    setNavigationPath(prev => prev.slice(0, index + 1));
  }, [navigationPath.length]);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="header-title">MMN Network Vision</h1>
      </header>

      <div className="breadcrumb animate-fade-in">
        {navigationPath.map((node, idx) => {
          const isLast = idx === navigationPath.length - 1;
          return (
            <React.Fragment key={node.id}>
              <div 
                className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                onClick={() => handleBreadcrumbClick(idx)}
                title={isLast ? 'Sua visualização atual' : 'Voltar para este nível'}
              >
                {idx === 0 && <Home size={16} />}
                <span>{idx === 0 ? 'Rede Principal' : node.name}</span>
              </div>
              {!isLast && (
                <ChevronRight size={14} className="breadcrumb-separator" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '4rem 0', color: 'var(--accent-yellow)' }}>
          <Loader2 size={48} className="animate-spin" />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Comunicando com a API Segura...</p>
        </div>
      ) : error ? (
        <div className="empty-state animate-fade-in" style={{ borderColor: 'var(--primary-purple)' }}>
          <AlertTriangle size={48} className="empty-icon mx-auto" style={{ color: '#ef4444' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', marginTop: '1rem', color: '#ef4444' }}>Erro de Conexão</h3>
          <p>{error}</p>
        </div>
      ) : (
        <NetworkView 
          referenceUser={currentNetwork} 
          onDrillDown={handleDrillDown} 
          level={currentLevel}
        />
      )}
      
      <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>A navegação exibe uma estrutura organizacional 'guarda-chuva'.</p>
        <p>Dados agora integrados com uma infraestrutura Backend API</p>
      </div>
    </div>
  );
}

export default App;
