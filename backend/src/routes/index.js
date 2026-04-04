const express = require('express');
const rateLimit = require('express-rate-limit');
const { authRequired } = require('../middleware/auth');
const authController = require('../controllers/authController');
const itemController = require('../controllers/itemController');

const router = express.Router();

const authEndpointLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const prodOnlyAuthLimit = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') return authEndpointLimiter(req, res, next);
  return next();
};

// Do not rate-limit the entire API. In dev/test, skip login/register limits so Playwright/Cypress
// parallel runs do not hit HTTP 429 (Too Many Requests).

router.post('/register', prodOnlyAuthLimit, authController.register);
router.post('/login', prodOnlyAuthLimit, authController.login);

router.get('/items', itemController.listItems);
router.get('/item/:id', itemController.getItem);

router.post('/lost/report', authRequired, itemController.reportLost);
router.post('/found/report', authRequired, itemController.reportFound);
router.put('/item/:id/update', authRequired, itemController.updateItem);
router.delete('/item/:id/delete', authRequired, itemController.deleteItem);
router.post('/item/contact-owner', authRequired, itemController.contactOwner);
router.get('/user/my-items', authRequired, itemController.myItems);

module.exports = router;
