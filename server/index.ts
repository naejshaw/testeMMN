import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './database.js';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'mmn-super-secret-123';

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION ENDPOINTS ---

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const existing = db.prepare('SELECT id FROM Users WHERE email = ?').get(email);
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hash = bcrypt.hashSync(password, 10);
    const id = `USR-${Date.now()}`;
    const joinDate = new Date().toLocaleDateString('pt-BR');
    // New users always start at the bottom of the ladder
    const plan = 'Iniciante';
    const revenue = 0; // New users start at zero
    const avatarUrl = `https://i.pravatar.cc/150?u=${id}`;

    const stmt = db.prepare(`
      INSERT INTO Users (id, name, email, password, plan, joinDate, revenue, avatarUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, name, email, hash, plan, joinDate, revenue, avatarUrl);

    // If a sponsorId is provided (e.g. from referral link), link them up
    if (req.body.sponsorId) {
      const refStmt = db.prepare('INSERT INTO Referrals (sponsor_id, affiliate_id) VALUES (?, ?)');
      refStmt.run(req.body.sponsorId, id);
    }

    const token = jwt.sign({ id, name, email, plan, avatarUrl }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { id, name, email, plan, avatarUrl } });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email) as any;
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, plan: user.plan, avatarUrl: user.avatarUrl }, JWT_SECRET, { expiresIn: '1d' });
    
    // Do not return password hash
    const { password: _, ...userData } = user;
    return res.json({ token, user: userData });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// --- PROFILE ENDPOINT ---
app.put('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  let authenticatedUserId = '';
  try {
    const decoded: any = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    authenticatedUserId = decoded.id;
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { name, email, avatarUrl, currentPassword, newPassword } = req.body;

  try {
    const user = db.prepare('SELECT * FROM Users WHERE id = ?').get(authenticatedUserId) as any;
    if (!user) return res.status(404).json({ error: 'User not found' });

    let finalPasswordHash = user.password;

    // Handle password update
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: 'Senha atual é obrigatória para trocar a senha' });
      if (!bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }
      finalPasswordHash = bcrypt.hashSync(newPassword, 10);
    }

    // Check if new email is taken by someone else
    if (email !== user.email) {
      const existing = db.prepare('SELECT id FROM Users WHERE email = ?').get(email);
      if (existing) return res.status(400).json({ error: 'Email já está em uso por outra conta' });
    }

    const stmt = db.prepare(`
      UPDATE Users 
      SET name = ?, email = ?, avatarUrl = ?, password = ?
      WHERE id = ?
    `);
    
    stmt.run(name || user.name, email || user.email, avatarUrl || user.avatarUrl, finalPasswordHash, authenticatedUserId);

    // Get fresh data to return a new token
    const freshUser = db.prepare('SELECT * FROM Users WHERE id = ?').get(authenticatedUserId) as any;
    const token = jwt.sign({ 
      id: freshUser.id, name: freshUser.name, email: freshUser.email, 
      plan: freshUser.plan, avatarUrl: freshUser.avatarUrl 
    }, JWT_SECRET, { expiresIn: '1d' });

    const { password: _, ...userData } = freshUser;
    return res.json({ token, user: userData, message: 'Perfil atualizado com sucesso!' });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// --- PROTECTED NETWORK ENDPOINTS ---

// Recursive helper to build network tree from DB
function getNetworkTree(userId: string, currentDepth = 0, maxDepth = 5): any {
  if (currentDepth > maxDepth) return [];
  
  // Get direct children
  const childrenRows = db.prepare(`
    SELECT u.id, u.name, u.plan, u.joinDate, u.revenue, u.avatarUrl
    FROM Referrals r
    JOIN Users u ON r.affiliate_id = u.id
    WHERE r.sponsor_id = ?
  `).all(userId) as any[];

  return childrenRows.map(child => ({
    ...child,
    children: getNetworkTree(child.id, currentDepth + 1, maxDepth)
  }));
}

app.get('/api/network/:userId', (req, res) => {
  const targetUserId = req.params.userId;
  const authHeader = req.headers.authorization;
  let authenticatedUserId = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      authenticatedUserId = decoded.id;
    } catch (e) {
      // invalid token
    }
  }

  // Get root target node
  const userNode = db.prepare('SELECT id, name, plan, joinDate, revenue, avatarUrl FROM Users WHERE id = ?').get(targetUserId) as any;
  if (!userNode) return res.status(404).json({ error: 'User not found' });

  // Security: mask revenue if the authenticated user is not looking at themselves
  if (authenticatedUserId !== userNode.id) {
    userNode.revenue = 0;
  }

  userNode.children = getNetworkTree(targetUserId, 1);

  // Deep sanitize children revenues
  function sanitizeRevenues(children: any[]) {
    for (const child of children) {
      child.revenue = 0;
      if (child.children) sanitizeRevenues(child.children);
    }
  }
  sanitizeRevenues(userNode.children);

  return res.json(userNode);
});

// --- DASHBOARD METRICS ---
app.get('/api/dashboard/metrics', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  let authenticatedUserId = '';
  try {
    const decoded: any = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    authenticatedUserId = decoded.id;
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Get Personal Earnings
  const user = db.prepare('SELECT revenue FROM Users WHERE id = ?').get(authenticatedUserId) as any;
  
  // Find top performer in Direct Network
  const topPerformer = db.prepare(`
    SELECT u.id, u.name, u.plan, u.avatarUrl
    FROM Referrals r
    JOIN Users u ON r.affiliate_id = u.id
    WHERE r.sponsor_id = ?
    ORDER BY u.revenue DESC
    LIMIT 1
  `).get(authenticatedUserId) as any;

  return res.json({
    personalEarnings: user?.revenue || 0,
    topPerformer: topPerformer || null
  });
});

app.listen(PORT, () => {
  console.log(`✅ SaaS API Backend running on http://localhost:${PORT}`);
});
