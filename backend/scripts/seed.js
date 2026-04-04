require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345678',
    database: process.env.DB_NAME || 'findit',
    multipleStatements: true,
  });

  const hash = await bcrypt.hash('TestPass123!', 10);
  await conn.execute(
    `INSERT IGNORE INTO users (id, email, password_hash, first_name, last_name)
     VALUES (1, 'alice@findit.demo', ?, 'Alice', 'Anderson')`,
    [hash]
  );
  await conn.execute(
    `INSERT IGNORE INTO users (id, email, password_hash, first_name, last_name)
     VALUES (2, 'bob@findit.demo', ?, 'Bob', 'Brown')`,
    [hash]
  );
  await conn.execute(
    `INSERT IGNORE INTO users (id, email, password_hash, first_name, last_name)
     VALUES (3, 'carol@findit.demo', ?, 'Carol', 'Chen')`,
    [hash]
  );

  await conn.execute(
    `INSERT IGNORE INTO lost_items (id, user_id, title, description, location, category, lost_date, status)
     VALUES
     (1, 1, 'Blue Backpack', 'Nike backpack with laptop sleeve.', 'Central Park', 'Bags', '2026-03-15', 'open'),
     (2, 1, 'House Keys', 'Three keys on red fob.', 'Coffee Hub', 'Keys', '2026-03-20', 'open'),
     (3, 2, 'Prescription Glasses', 'Black frames in brown case.', 'Metro Station', 'Accessories', '2026-03-28', 'resolved')`
  );

  await conn.execute(
    `INSERT IGNORE INTO found_items (id, user_id, title, description, location, category, found_date, status)
     VALUES
     (1, 2, 'Striped Umbrella', 'Blue and white stripes.', 'Library', 'Other', '2026-03-18', 'open'),
     (2, 3, 'Student ID Card', 'Local university.', 'Bus stop Main St', 'IDs', '2026-04-01', 'open')`
  );

  console.log('Seed complete. Demo password for alice/bob/carol: TestPass123!');
  await conn.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
