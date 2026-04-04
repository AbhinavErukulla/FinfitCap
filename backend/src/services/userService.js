const bcrypt = require('bcryptjs');
const { query } = require('../config/db');

async function findByEmail(email) {
  const rows = await query('SELECT * FROM users WHERE email = :email LIMIT 1', { email });
  return rows[0] || null;
}

async function findById(id) {
  const rows = await query(
    'SELECT id, email, first_name, last_name, created_at FROM users WHERE id = :id LIMIT 1',
    { id }
  );
  return rows[0] || null;
}

async function createUser({ firstName, lastName, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name)
     VALUES (:email, :passwordHash, :firstName, :lastName)`,
    { email, passwordHash, firstName, lastName }
  );
  return result.insertId;
}

async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

async function storeSession({ userId, tokenHash, refreshHash, userAgent, ip, expiresAt }) {
  await query(
    `INSERT INTO user_sessions (user_id, token_hash, refresh_token_hash, user_agent, ip_address, expires_at)
     VALUES (:userId, :tokenHash, :refreshHash, :userAgent, :ip, :expiresAt)`,
    { userId, tokenHash, refreshHash, userAgent, ip, expiresAt }
  );
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  verifyPassword,
  storeSession,
};
