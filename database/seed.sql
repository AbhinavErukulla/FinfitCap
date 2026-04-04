-- Sample seed data (password for all demo users: TestPass123!)
-- bcrypt hash for TestPass123! (cost 10)
SET @demo_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

INSERT INTO users (email, password_hash, first_name, last_name, remember_me) VALUES
('alice@findit.demo', @demo_hash, 'Alice', 'Anderson', 0),
('bob@findit.demo', @demo_hash, 'Bob', 'Brown', 0),
('carol@findit.demo', @demo_hash, 'Carol', 'Chen', 1);

-- Note: Replace @demo_hash with real bcrypt from backend for local dev if needed.
-- Application registers users with bcrypt; this placeholder may not match unless you bcrypt 'TestPass123!'
-- Re-run registration via API or use: UPDATE users SET password_hash = '<bcrypt from node>' WHERE email = 'alice@findit.demo';

INSERT INTO lost_items (user_id, title, description, location, category, lost_date, status, contact_phone) VALUES
(1, 'Blue Backpack', 'Nike backpack with laptop sleeve, small tear on strap.', 'Central Park East Entrance', 'Bags', '2026-03-15', 'open', '+15550001111'),
(1, 'House Keys with Red Fob', 'Three keys on a red silicone fob.', 'Downtown Coffee Hub', 'Keys', '2026-03-20', 'open', NULL),
(2, 'Prescription Glasses', 'Black rectangular frames in a brown case.', 'Metro Station Line 2', 'Accessories', '2026-03-28', 'resolved', '+15550002222');

INSERT INTO found_items (user_id, title, description, location, category, found_date, status, contact_phone) VALUES
(2, 'Umbrella – Striped', 'Foldable umbrella, blue and white stripes.', 'Library 2nd floor', 'Other', '2026-03-18', 'open', '+15550002222'),
(3, 'Student ID Card', 'Name partially rubbed; belongs to local university.', 'Bus stop Main St', 'IDs', '2026-04-01', 'open', NULL);

INSERT INTO item_images (item_type, item_id, image_url, sort_order) VALUES
('lost', 1, '/uploads/placeholder-backpack.jpg', 0),
('found', 1, '/uploads/placeholder-umbrella.jpg', 0);

INSERT INTO item_contacts (item_type, item_id, from_user_id, to_user_id, message, contact_email) VALUES
('lost', 1, 2, 1, 'I think I saw something similar near the fountain.', 'bob@findit.demo');

INSERT INTO audit_logs (user_id, action, entity, entity_id, details, ip_address) VALUES
(1, 'REGISTER', 'user', 1, JSON_OBJECT('email','alice@findit.demo'), '127.0.0.1'),
(1, 'CREATE', 'lost_item', 1, JSON_OBJECT('title','Blue Backpack'), '127.0.0.1');
