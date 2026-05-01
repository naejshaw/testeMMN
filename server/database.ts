import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('mmn.db');

// Optimization
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    plan TEXT NOT NULL,
    joinDate TEXT NOT NULL,
    revenue INTEGER DEFAULT 0,
    avatarUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS Referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sponsor_id TEXT NOT NULL,
    affiliate_id TEXT UNIQUE NOT NULL,
    FOREIGN KEY(sponsor_id) REFERENCES Users(id),
    FOREIGN KEY(affiliate_id) REFERENCES Users(id)
  );
`);

// Seed root user if DB is empty
const rootCheck = db.prepare('SELECT id FROM Users WHERE id = ?').get('USR-0');
if (!rootCheck) {
  const hash = bcrypt.hashSync('admin123', 10);
  const stmt = db.prepare(`
    INSERT INTO Users (id, name, email, password, plan, joinDate, revenue, avatarUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run('USR-0', 'Root Admin', 'admin@mmn.com', hash, 'Diamante', new Date().toLocaleDateString('pt-BR'), 154300, 'https://i.pravatar.cc/150?u=0');
}

export default db;
