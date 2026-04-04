-- Database validation & test queries for FindIt QA

-- 1) Data validation: users must have unique emails
SELECT email, COUNT(*) AS cnt FROM users GROUP BY email HAVING cnt > 1;

-- 2) Referential integrity: orphaned lost items
SELECT l.id FROM lost_items l LEFT JOIN users u ON u.id = l.user_id WHERE u.id IS NULL;

-- 3) Insert test (rollback in transaction)
START TRANSACTION;
INSERT INTO users (email, password_hash, first_name, last_name)
VALUES ('qa_insert@test.com', 'hash', 'QA', 'Insert');
SELECT id, email FROM users WHERE email = 'qa_insert@test.com';
ROLLBACK;

-- 4) Update test pattern (dry run select)
SELECT id, status FROM lost_items WHERE id = 1;
-- UPDATE lost_items SET status = 'closed' WHERE id = 1;

-- 5) Delete cascade: deleting user removes items (verify FK)
SELECT COUNT(*) FROM lost_items WHERE user_id = 999;

-- 6) Search filter: lost items by location substring
SELECT id, title, location FROM lost_items WHERE location LIKE '%Park%' ORDER BY created_at DESC;

-- 7) Search filter: full-text style (LIKE for portability)
SELECT id, title FROM found_items
WHERE title LIKE '%umbrella%' OR description LIKE '%umbrella%' OR location LIKE '%umbrella%';

-- 8) Join: items with owner names
SELECT 'lost' AS type, l.id, l.title, u.first_name, u.last_name
FROM lost_items l JOIN users u ON u.id = l.user_id
UNION ALL
SELECT 'found', f.id, f.title, u.first_name, u.last_name
FROM found_items f JOIN users u ON u.id = f.user_id;

-- 9) Pagination pattern
SELECT id, title, created_at FROM lost_items ORDER BY created_at DESC LIMIT 10 OFFSET 0;

-- 10) Contacts with item context
SELECT c.id, c.item_type, c.item_id, c.message, uf.email AS from_email, ut.email AS to_email
FROM item_contacts c
JOIN users uf ON uf.id = c.from_user_id
JOIN users ut ON ut.id = c.to_user_id;

-- 11) UI vs DB: count open lost vs API expectation
SELECT status, COUNT(*) FROM lost_items GROUP BY status;

-- 12) Audit recent actions
SELECT action, entity, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 20;

-- 13) Sessions not expired
SELECT s.id, u.email, s.expires_at FROM user_sessions s JOIN users u ON u.id = s.user_id WHERE s.expires_at > NOW();

-- 14) Images per item
SELECT item_type, item_id, COUNT(*) AS image_count FROM item_images GROUP BY item_type, item_id;
