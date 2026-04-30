import React, { useMemo, useState } from 'react';
import type { UserNode } from '../services/api';
import { UserCard } from './UserCard';
import { Users, AlertCircle, ArrowUpRight, Network, Filter, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

interface NetworkViewProps {
  referenceUser: UserNode | null;
  onDrillDown: (user: UserNode) => void;
  level: number;
}

const getNodesByDepth = (node: UserNode, targetDepth: number, currentDepth = 1): UserNode[] => {
  if (currentDepth === targetDepth) {
    return node.children;
  }
  let result: UserNode[] = [];
  for (const child of node.children) {
    result = result.concat(getNodesByDepth(child, targetDepth, currentDepth + 1));
  }
  return result;
};

const getAllDescendants = (node: UserNode): UserNode[] => {
  let result: UserNode[] = [...node.children];
  for (const child of node.children) {
    result = result.concat(getAllDescendants(child));
  }
  return result;
};

export const NetworkView: React.FC<NetworkViewProps> = ({ referenceUser, onDrillDown, level }) => {
  const [depthFilter, setDepthFilter] = useState<string>('1');
  const [pageSize, setPageSize] = useState<number>(20); // 20 cards per page
  const [currentPage, setCurrentPage] = useState<number>(1);

  if (!referenceUser) return null;

  const calculateTotalDescendants = (node: UserNode): number => {
    if (!node.children || node.children.length === 0) return 0;
    return node.children.reduce((total, child) => {
      return total + 1 + calculateTotalDescendants(child);
    }, 0);
  };

  const redeDireta = referenceUser.children.length;
  const redeCompleta = calculateTotalDescendants(referenceUser);
  const redeIndireta = redeCompleta - redeDireta;

  // Filter nodes based on depth selection
  const filteredNodes = useMemo(() => {
    if (depthFilter === 'Todos') {
      return getAllDescendants(referenceUser);
    }
    const depthNum = parseInt(depthFilter, 10);
    return getNodesByDepth(referenceUser, depthNum);
  }, [referenceUser, depthFilter]);

  // Paginate filtered nodes
  const totalPages = Math.max(1, pageSize === Infinity ? 1 : Math.ceil(filteredNodes.length / pageSize));
  
  // Safe bounds for current page
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedNodes = useMemo(() => {
    if (pageSize === Infinity) return filteredNodes;
    const startIndex = (safePage - 1) * pageSize;
    return filteredNodes.slice(startIndex, startIndex + pageSize);
  }, [filteredNodes, pageSize, safePage]);

  // Reset pagination when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [depthFilter, pageSize, referenceUser]);

  const renderedChildren = useMemo(() => {
    return paginatedNodes.map((child, idx) => (
      <UserCard 
        key={`${child.id}-${depthFilter}`} // Force re-render animations
        user={child} 
        onClick={onDrillDown} 
        index={idx} 
      />
    ));
  }, [paginatedNodes, onDrillDown, depthFilter]);

  return (
    <div className="network-section animate-fade-in">
      {/* ... keeping reference card mostly identical ... */}
      <div className="reference-node-container">
        <div className="reference-card">
          <img src={referenceUser.avatarUrl} alt={referenceUser.name} className="reference-avatar" />
          <div className="reference-info">
            <h2 className="reference-name">{referenceUser.name}</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <span className={`plan-badge plan-${referenceUser.plan}`}>
                {referenceUser.plan}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Nível Atual do Referência: {level}
              </span>
            </div>
            
            <div className="reference-stats" style={{ flexWrap: 'wrap' }}>
              <div className="stat">
                <span className="stat-label">Rede Direta</span>
                <span className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Users size={16} /> 
                  {redeDireta}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Rede Indireta</span>
                <span className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)' }}>
                  <Users size={16} style={{ opacity: 0.7 }} /> 
                  {redeIndireta}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Rede Completa</span>
                <span className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-yellow)' }}>
                  <Network size={16} /> 
                  {redeCompleta}
                </span>
              </div>
              {level === 0 && (
                <div className="stat">
                  <span className="stat-label">Rendimento</span>
                  <span className="stat-value" style={{ color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
                    <ArrowUpRight size={16} />
                    R$ {referenceUser.revenue.toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="network-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="network-title">
          <Users size={20} />
          <span>Exibindo:</span> {filteredNodes.length} Afiliados
        </div>
        
        {/* Controls Toolbar */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          background: 'var(--glass-bg)', 
          padding: '1rem', 
          borderRadius: '12px', 
          border: '1px solid var(--card-border)' 
        }}>
          {/* Depth Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={16} color="var(--primary-purple-light)" />
            <span style={{ fontSize: '0.85rem' }}>Nível:</span>
            <select 
              value={depthFilter} 
              onChange={(e) => setDepthFilter(e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'white', border: '1px solid var(--card-border)', cursor: 'pointer' }}
            >
              <option value="1">Nível 1 (Apenas Diretos)</option>
              <option value="2">Nível 2 (Indiretos de 1º grau)</option>
              <option value="3">Nível 3 (Indiretos de 2º grau)</option>
              <option value="Todos">Todos os Níveis (Misturados)</option>
            </select>
          </div>

          {/* Page Size Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--primary-purple-light)" />
            <span style={{ fontSize: '0.85rem' }}>Mostrar:</span>
            <select 
              value={pageSize === Infinity ? 'Todos' : pageSize.toString()} 
              onChange={(e) => setPageSize(e.target.value === 'Todos' ? Infinity : Number(e.target.value))}
              style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--primary-dark)', color: 'white', border: '1px solid var(--card-border)', cursor: 'pointer' }}
            >
              <option value="10">10 por página</option>
              <option value="20">20 por página</option>
              <option value="50">50 por página</option>
              <option value="Todos">Todos</option>
            </select>
          </div>
        </div>
      </div>

      {filteredNodes.length > 0 ? (
        <>
          <div className="grid-container">
            {renderedChildren}
          </div>
          
          {/* Pagination Controls */}
          {pageSize !== Infinity && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
              <button 
                disabled={safePage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: safePage === 1 ? 'not-allowed' : 'pointer', opacity: safePage === 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={20} />
              </button>
              
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Página <strong style={{ color: 'var(--accent-yellow)' }}>{safePage}</strong> de {totalPages}
              </span>
              
              <button 
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', opacity: safePage === totalPages ? 0.5 : 1 }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state animate-fade-in">
          <AlertCircle size={48} className="empty-icon mx-auto" />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', marginTop: '1rem', color: 'var(--text-main)' }}>Nenhum Afiliado Encontrado</h3>
          <p>O afiliado não possui rede no nível selecionado ({depthFilter}).</p>
        </div>
      )}
    </div>
  );
};
