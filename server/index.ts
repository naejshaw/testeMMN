import express from 'express';
import cors from 'cors';
import { getUserById, UserNode } from './db.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Deep clone helper to prevent mutating our "in-memory" DB
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Endpoint fetcher
app.get('/api/network/:userId', (req, res) => {
  const targetUserId = req.params.userId;
  
  // Simulate Authentication Header (e.g. who is calling the API)
  // For the sake of the prototype, we expect 'x-auth-user-id'
  // If not provided, we assume the user is trying to access anonymously.
  const authenticatedUserId = req.headers['x-auth-user-id'] as string;

  const userNode = getUserById(targetUserId);

  if (!userNode) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Clone the node so we can mutate it securely for the payload
  const payloadNode = deepClone(userNode);

  // Payload Security Rules (Remove revenue for non-authenticated nodes)
  // 1. We must hide the revenue of the userNode if requested by someone else.
  if (authenticatedUserId !== payloadNode.id) {
    payloadNode.revenue = 0; // Or omit completely depending on TS interfaces
  }

  // 2. We must hide the revenue of ALL descendants (children) regardless.
  // We can write a recursive cleaner
  function sanitizeNetworkData(node: UserNode) {
    if (node.children) {
      for (const child of node.children) {
        // Obscure their revenue since they are just "network members"
        child.revenue = 0;
        sanitizeNetworkData(child);
      }
    }
  }

  // Sanitize down the tree
  sanitizeNetworkData(payloadNode);

  return res.json(payloadNode);
});

app.listen(PORT, () => {
  console.log(`✅ Secure MMN Backend API running on http://localhost:${PORT}`);
});
