// Types must match what the backend sends
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

const API_BASE = 'http://localhost:3000/api';

/**
 * Fetches the user network structure from the backend API.
 * Uses a fake X-Auth header to pretend we are logged in as root ("USR-0").
 */
export async function fetchUserNetwork(targetUserId: string): Promise<UserNode> {
  const token = localStorage.getItem('mmn_token');
  const response = await fetch(`${API_BASE}/network/${targetUserId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user network. Status: ${response.status}`);
  }

  return response.json();
}
