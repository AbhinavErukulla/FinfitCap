const { query } = require('../config/db');

async function createLost({ userId, title, description, location, category, lostDate, contactPhone }) {
  const r = await query(
    `INSERT INTO lost_items (user_id, title, description, location, category, lost_date, contact_phone)
     VALUES (:userId, :title, :description, :location, :category, :lostDate, :contactPhone)`,
    {
      userId,
      title,
      description,
      location,
      category,
      lostDate: lostDate || null,
      contactPhone,
    }
  );
  return r.insertId;
}

async function createFound({ userId, title, description, location, category, foundDate, contactPhone }) {
  const r = await query(
    `INSERT INTO found_items (user_id, title, description, location, category, found_date, contact_phone)
     VALUES (:userId, :title, :description, :location, :category, :foundDate, :contactPhone)`,
    {
      userId,
      title,
      description,
      location,
      category,
      foundDate: foundDate || null,
      contactPhone,
    }
  );
  return r.insertId;
}

function buildItemListQuery(filters) {
  const { q, type, status, page, pageSize } = filters;
  const limit = Math.min(Math.max(Number(pageSize) || 10, 1), 100);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

  const conditionsLost = ["1=1"];
  const conditionsFound = ["1=1"];
  const params = { limit, offset };

  if (q) {
    conditionsLost.push('(l.title LIKE :q OR l.description LIKE :q OR l.location LIKE :q)');
    conditionsFound.push('(f.title LIKE :q OR f.description LIKE :q OR f.location LIKE :q)');
    params.q = `%${q}%`;
  }
  if (status) {
    conditionsLost.push('l.status = :statusLost');
    conditionsFound.push('f.status = :statusFound');
    params.statusLost = status;
    params.statusFound = status;
  }

  const lostSql =
    type === 'found'
      ? ''
      : `
    SELECT 'lost' AS item_type, l.id, l.title, l.description, l.location, l.status,
           l.created_at, u.email AS owner_email, u.first_name, u.last_name, l.user_id
    FROM lost_items l JOIN users u ON u.id = l.user_id
    WHERE ${conditionsLost.join(' AND ')}
  `;
  const foundSql =
    type === 'lost'
      ? ''
      : `
    SELECT 'found' AS item_type, f.id, f.title, f.description, f.location, f.status,
           f.created_at, u.email AS owner_email, u.first_name, u.last_name, f.user_id
    FROM found_items f JOIN users u ON u.id = f.user_id
    WHERE ${conditionsFound.join(' AND ')}
  `;

  let union = '';
  if (lostSql && foundSql) {
    union = `${lostSql} UNION ALL ${foundSql}`;
  } else if (lostSql) {
    union = lostSql;
  } else {
    union = foundSql;
  }

  const listSql = `
    SELECT * FROM (${union}) AS items
    ORDER BY created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const countSql = `
    SELECT COUNT(*) AS total FROM (${union}) AS c
  `;

  return { listSql, countSql, params };
}

async function listItems(filters) {
  const { listSql, countSql, params } = buildItemListQuery(filters);
  const rows = await query(listSql, params);
  const countRows = await query(countSql, params);
  const total = countRows[0]?.total || 0;
  return { items: rows, total };
}

async function getItem(itemType, id) {
  if (itemType === 'lost') {
    const rows = await query(
      `SELECT l.*, u.email AS owner_email, u.first_name, u.last_name
       FROM lost_items l JOIN users u ON u.id = l.user_id
       WHERE l.id = :id LIMIT 1`,
      { id }
    );
    if (!rows[0]) return null;
    return { itemType: 'lost', ...rows[0] };
  }
  const rows = await query(
    `SELECT f.*, u.email AS owner_email, u.first_name, u.last_name
     FROM found_items f JOIN users u ON u.id = f.user_id
     WHERE f.id = :id LIMIT 1`,
    { id }
  );
  if (!rows[0]) return null;
  return { itemType: 'found', ...rows[0] };
}

async function updateItem(itemType, id, userId, patch) {
  const table = itemType === 'lost' ? 'lost_items' : 'found_items';
  const fields = [];
  const params = { id, userId };

  if (patch.title !== undefined) {
    fields.push('title = :title');
    params.title = patch.title;
  }
  if (patch.description !== undefined) {
    fields.push('description = :description');
    params.description = patch.description;
  }
  if (patch.location !== undefined) {
    fields.push('location = :location');
    params.location = patch.location;
  }
  if (patch.status !== undefined) {
    if (itemType === 'lost' && ['open', 'resolved', 'closed'].includes(patch.status)) {
      fields.push('status = :status');
      params.status = patch.status;
    }
    if (itemType === 'found' && ['open', 'returned', 'closed'].includes(patch.status)) {
      fields.push('status = :status');
      params.status = patch.status;
    }
  }
  if (fields.length === 0) return 0;

  const sql = `UPDATE ${table} SET ${fields.join(', ')} WHERE id = :id AND user_id = :userId`;
  const r = await query(sql, params);
  return r.affectedRows;
}

async function deleteItem(itemType, id, userId) {
  const table = itemType === 'lost' ? 'lost_items' : 'found_items';
  const r = await query(`DELETE FROM ${table} WHERE id = :id AND user_id = :userId`, { id, userId });
  return r.affectedRows;
}

async function getOwnerId(itemType, id) {
  const table = itemType === 'lost' ? 'lost_items' : 'found_items';
  const rows = await query(`SELECT user_id FROM ${table} WHERE id = :id LIMIT 1`, { id });
  return rows[0]?.user_id || null;
}

async function createContact({
  itemType,
  itemId,
  fromUserId,
  toUserId,
  message,
  contactEmail,
}) {
  const r = await query(
    `INSERT INTO item_contacts (item_type, item_id, from_user_id, to_user_id, message, contact_email)
     VALUES (:itemType, :itemId, :fromUserId, :toUserId, :message, :contactEmail)`,
    { itemType, itemId, fromUserId, toUserId, message, contactEmail }
  );
  return r.insertId;
}

async function listMyItems(userId) {
  const lost = await query(
    `SELECT 'lost' AS item_type, id, title, status, created_at FROM lost_items WHERE user_id = :userId`,
    { userId }
  );
  const found = await query(
    `SELECT 'found' AS item_type, id, title, status, created_at FROM found_items WHERE user_id = :userId`,
    { userId }
  );
  return { lost, found };
}

module.exports = {
  createLost,
  createFound,
  listItems,
  getItem,
  updateItem,
  deleteItem,
  getOwnerId,
  createContact,
  listMyItems,
};
