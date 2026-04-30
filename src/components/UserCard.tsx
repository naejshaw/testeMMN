import React from 'react';
import type { UserNode } from '../services/api';
import { Users, Calendar, ChevronRight } from 'lucide-react';

interface UserCardProps {
  user: UserNode;
  onClick: (user: UserNode) => void;
  index: number;
}

export const UserCard: React.FC<UserCardProps> = React.memo(({ user, onClick, index }) => {
  // Add staggered animation delay based on index for performant smooth entry
  const animationStyle = {
    animationDelay: `${Math.min(index * 0.03, 0.5)}s`,
    opacity: 0
  };

  return (
    <div 
      className="user-card animate-fade-in" 
      style={animationStyle}
      onClick={() => onClick(user)}
    >
      <div className="user-card-header">
        <img src={user.avatarUrl} alt={user.name} className="card-avatar" loading="lazy" />
        <div className="card-info">
          <h3 className="card-name" title={user.name}>{user.name}</h3>
          <span className={`plan-badge plan-${user.plan}`}>
            {user.plan}
          </span>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="card-stat">
          <span className="card-stat-label">Ingresso</span>
          <div className="card-stat-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} className="text-muted" />
            {user.joinDate}
          </div>
        </div>
        
        <div className="network-size-badge" title="Tamanho da rede direta">
          <Users size={14} />
          <span>{user.children.length}</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
});
