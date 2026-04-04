const validator = require('validator');

function sanitizeString(str, max = 5000) {
  if (str == null) return '';
  let s = String(str).trim();
  if (s.length > max) s = s.slice(0, max);
  return validator.escape(s);
}

function validateRegister(body) {
  const errors = {};
  const first = body.firstName != null ? String(body.firstName).trim() : '';
  const last = body.lastName != null ? String(body.lastName).trim() : '';
  const email = body.email != null ? String(body.email).trim().toLowerCase() : '';
  const password = body.password != null ? String(body.password) : '';
  const confirm = body.confirmPassword != null ? String(body.confirmPassword) : '';

  if (first.length < 1 || first.length > 100) errors.firstName = 'First name must be 1–100 characters.';
  if (last.length < 1 || last.length > 100) errors.lastName = 'Last name must be 1–100 characters.';
  if (!validator.isEmail(email)) errors.email = 'Valid email is required.';
  if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
  if (password.length > 128) errors.password = 'Password is too long.';
  if (password !== confirm) errors.confirmPassword = 'Passwords do not match.';

  return { errors, values: { first, last, email, password } };
}

function validateLogin(body) {
  const errors = {};
  const email = body.email != null ? String(body.email).trim().toLowerCase() : '';
  const password = body.password != null ? String(body.password) : '';
  if (!validator.isEmail(email)) errors.email = 'Valid email is required.';
  if (password.length < 1) errors.password = 'Password is required.';
  return { errors, values: { email, password } };
}

function validateItemReport(body, kind) {
  const errors = {};
  const title = body.title != null ? String(body.title).trim() : '';
  const description = body.description != null ? String(body.description).trim() : '';
  const location = body.location != null ? String(body.location).trim() : '';
  const category = body.category != null ? String(body.category).trim() : '';
  const dateField = kind === 'lost' ? body.lostDate : body.foundDate;
  const dateStr = dateField != null ? String(dateField).trim() : '';
  const contactPhone = body.contactPhone != null ? String(body.contactPhone).trim() : '';

  if (title.length < 3 || title.length > 200) errors.title = 'Title must be 3–200 characters.';
  if (description.length < 10 || description.length > 5000)
    errors.description = 'Description must be 10–5000 characters.';
  if (location.length < 2 || location.length > 255) errors.location = 'Location must be 2–255 characters.';
  if (category.length > 100) errors.category = 'Category too long.';
  if (dateStr && !validator.isISO8601(dateStr) && !/^\d{4}-\d{2}-\d{2}$/.test(dateStr))
    errors[kind === 'lost' ? 'lostDate' : 'foundDate'] = 'Invalid date format (YYYY-MM-DD).';
  if (contactPhone && contactPhone.length > 50) errors.contactPhone = 'Phone too long.';

  return {
    errors,
    values: {
      title,
      description,
      location,
      category: category || null,
      itemDate: dateStr || null,
      contactPhone: contactPhone || null,
    },
  };
}

function validateContact(body) {
  const errors = {};
  const itemType = body.itemType != null ? String(body.itemType).toLowerCase() : '';
  const itemId = body.itemId;
  const message = body.message != null ? String(body.message).trim() : '';
  const contactEmail = body.contactEmail != null ? String(body.contactEmail).trim().toLowerCase() : '';

  if (itemType !== 'lost' && itemType !== 'found') errors.itemType = 'itemType must be lost or found.';
  if (!itemId || !validator.isInt(String(itemId), { min: 1 }))
    errors.itemId = 'Valid itemId is required.';
  if (message.length < 5 || message.length > 2000) errors.message = 'Message must be 5–2000 characters.';
  if (!validator.isEmail(contactEmail)) errors.contactEmail = 'Valid contact email is required.';

  return { errors, values: { itemType, itemId: Number(itemId), message, contactEmail } };
}

function validateItemUpdate(body) {
  const errors = {};
  const title = body.title != null ? String(body.title).trim() : undefined;
  const description = body.description != null ? String(body.description).trim() : undefined;
  const location = body.location != null ? String(body.location).trim() : undefined;
  const status = body.status != null ? String(body.status).trim().toLowerCase() : undefined;

  if (title !== undefined && (title.length < 3 || title.length > 200))
    errors.title = 'Title must be 3–200 characters.';
  if (description !== undefined && (description.length < 10 || description.length > 5000))
    errors.description = 'Description must be 10–5000 characters.';
  if (location !== undefined && (location.length < 2 || location.length > 255))
    errors.location = 'Location must be 2–255 characters.';
  if (status !== undefined && !['open', 'closed', 'resolved', 'returned'].includes(status))
    errors.status = 'Invalid status.';

  return { errors, values: { title, description, location, status } };
}

module.exports = {
  sanitizeString,
  validateRegister,
  validateLogin,
  validateItemReport,
  validateContact,
  validateItemUpdate,
};
