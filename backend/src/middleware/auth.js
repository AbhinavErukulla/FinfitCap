const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return error(res, 'Authorization required', 401, 'UNAUTHORIZED');
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return error(res, 'Invalid or expired token', 401, 'INVALID_TOKEN');
  }
}

module.exports = { authRequired };
