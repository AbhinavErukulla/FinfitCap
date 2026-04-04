const { query } = require('../config/db');

async function log({ userId, action, entity, entityId, details, ip }) {
  try {
    await query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id, details, ip_address)
       VALUES (:userId, :action, :entity, :entityId, :details, :ip)`,
      {
        userId: userId || null,
        action,
        entity,
        entityId: entityId || null,
        details: details != null ? JSON.stringify(details) : null,
        ip: ip || null,
      }
    );
  } catch {
    // never fail request on audit
  }
}

module.exports = { log };
