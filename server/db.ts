export type PlanType = 'Iniciante' | 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';

export interface UserNode {
  id: string;
  name: string;
  joinDate: string;
  plan: PlanType;
  revenue: number;
  avatarUrl: string;
  children: UserNode[];
}

const firstNames = ['Ana', 'Bruno', 'Carlos', 'Diana', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Julia', 'Lucas', 'Mariana', 'Nicolas', 'Olivia', 'Pedro', 'Rafael', 'Sofia', 'Thiago', 'Vitória', 'Wagner', 'Yuri', 'Zeca'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Lopes', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Nascimento'];

const getRandomName = () => `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
const getRandomPlan = (): PlanType => {
  const r = Math.random();
  if (r > 0.95) return 'Diamante';
  if (r > 0.8) return 'Ouro';
  if (r > 0.5) return 'Prata';
  if (r > 0.2) return 'Bronze';
  return 'Iniciante';
};

let currentId = 1;

function generateChildren(depth: number, maxChildren: number): UserNode[] {
  if (depth === 0) return [];
  const numChildren = depth === 3 ? 50 : Math.max(0, Math.floor(Math.random() * maxChildren));
  
  const children: UserNode[] = [];
  for (let i = 0; i < numChildren; i++) {
    children.push({
      id: `USR-${currentId++}`,
      name: getRandomName(),
      joinDate: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('pt-BR'),
      plan: getRandomPlan(),
      revenue: Math.floor(Math.random() * 10000),
      avatarUrl: `https://i.pravatar.cc/150?u=${currentId}`,
      children: generateChildren(depth - 1, Math.floor(maxChildren / 2))
    });
  }
  return children;
}

const dbTree: UserNode = {
  id: `USR-0`,
  name: 'Você (Referência Raiz)',
  joinDate: new Date(Date.now() - 30000000000).toLocaleDateString('pt-BR'),
  plan: 'Diamante',
  revenue: 154300,
  avatarUrl: `https://i.pravatar.cc/150?u=0`,
  children: generateChildren(3, 50) 
};

// Flat index for quick O(1) retrieval
const usersMap = new Map<string, UserNode>();

function _buildIndex(node: UserNode) {
  usersMap.set(node.id, node);
  node.children.forEach(_buildIndex);
}
_buildIndex(dbTree);

export function getUserById(id: string): UserNode | undefined {
  return usersMap.get(id);
}

export function getAllUsers() {
  return Array.from(usersMap.values());
}
