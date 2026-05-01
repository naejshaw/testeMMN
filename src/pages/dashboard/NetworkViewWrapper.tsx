import React, { useState, useCallback, useEffect } from 'react';
import type { UserNode } from '../../services/api';
import { fetchUserNetwork } from '../../services/api';
import { NetworkView } from '../../components/NetworkView';
import { ChevronRight, Home, Loader2, AlertTriangle } from 'lucide-react';

interface PathNode {
  id: string;
  name: string;
}

const NetworkViewWrapper = () => {
  // Use the logged-in user as the starting point of the network
  const user = JSON.parse(localStorage.getItem('mmn_user') || '{}');
  
  const [navigationPath, setNavigationPath] = useState<PathNode[]>([{ id: user.id || 'USR-0', name: 'Minha Rede' }]);
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
          
          setNavigationPath((prev) => {
            const newPath = [...prev];
            // Don't overwrite the 'Minha Rede' label for root
            if (newPath.length > 1) {
              newPath[newPath.length - 1].name = data.name;
            }
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

  const handleDrillDown = useCallback((userNode: UserNode) => {
    setNavigationPath(prev => [...prev, { id: userNode.id, name: userNode.name }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBreadcrumbClick = useCallback((index: number) => {
    if (index === navigationPath.length - 1) return;
    setNavigationPath(prev => prev.slice(0, index + 1));
  }, [navigationPath.length]);

  return (
    <div className="animate-fade-in">
      <div className="breadcrumb animate-fade-in" style={{ marginBottom: '2rem' }}>
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
                <span>{node.name}</span>
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
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Mapeando conexões...</p>
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
    </div>
  );
};

export default NetworkViewWrapper;
