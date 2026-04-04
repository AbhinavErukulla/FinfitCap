const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { success, error } = require('../utils/response');
const {
  validateRegister,
  validateLogin,
  sanitizeString,
} = require('../middleware/validate');
const userService = require('../services/userService');
const auditService = require('../services/auditService');

function signToken(user, rememberMe) {
  const expiresIn = rememberMe ? '7d' : process.env.JWT_EXPIRES_IN || '8h';
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET || 'dev-secret-change-me',
    { expiresIn }
  );
}

async function register(req, res, next) {
  try {
    const { errors, values } = validateRegister(req.body);
    if (Object.keys(errors).length) {
      return error(res, 'Validation failed', 422, 'VALIDATION_ERROR', errors);
    }
    const existing = await userService.findByEmail(values.email);
    if (existing) {
      return error(res, 'Email already registered', 409, 'EMAIL_EXISTS');
    }
    const id = await userService.createUser({
      firstName: sanitizeString(values.first, 100),
      lastName: sanitizeString(values.last, 100),
      email: values.email,
      password: values.password,
    });
    await auditService.log({
      userId: id,
      action: 'REGISTER',
      entity: 'user',
      entityId: id,
      details: { email: values.email },
      ip: req.ip,
    });
    const user = await userService.findById(id);
    return success(res, { user }, 'Registered', 201);
  } catch (e) {
    return next(e);
  }
}

async function login(req, res, next) {
  try {
    const { errors, values } = validateLogin(req.body);
    if (Object.keys(errors).length) {
      return error(res, 'Validation failed', 422, 'VALIDATION_ERROR', errors);
    }
    const userRow = await userService.findByEmail(values.email);
    if (!userRow) {
      return error(res, 'Invalid credentials', 401, 'AUTH_FAILED');
    }
    const ok = await userService.verifyPassword(values.password, userRow.password_hash);
    if (!ok) {
      return error(res, 'Invalid credentials', 401, 'AUTH_FAILED');
    }
    const rememberMe = Boolean(req.body.rememberMe);
    const token = signToken({ id: userRow.id, email: userRow.email }, rememberMe);
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date();
    expires.setDate(expires.getDate() + (rememberMe ? 7 : 1));
    await userService.storeSession({
      userId: userRow.id,
      tokenHash,
      refreshHash: null,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      expiresAt: expires,
    });
    await auditService.log({
      userId: userRow.id,
      action: 'LOGIN',
      entity: 'user',
      entityId: userRow.id,
      details: { rememberMe },
      ip: req.ip,
    });
    const user = await userService.findById(userRow.id);
    return success(res, { token, user, rememberMe }, 'Logged in');
  } catch (e) {
    return next(e);
  }
}

module.exports = { register, login };
