const { success, error } = require('../utils/response');
const {
  validateItemReport,
  validateContact,
  validateItemUpdate,
  sanitizeString,
} = require('../middleware/validate');
const itemService = require('../services/itemService');
const auditService = require('../services/auditService');

async function reportLost(req, res, next) {
  try {
    const { errors, values } = validateItemReport(req.body, 'lost');
    if (Object.keys(errors).length) {
      return error(res, 'Validation failed', 422, 'VALIDATION_ERROR', errors);
    }
    const id = await itemService.createLost({
      userId: req.user.id,
      title: sanitizeString(values.title, 200),
      description: sanitizeString(values.description, 5000),
      location: sanitizeString(values.location, 255),
      category: values.category ? sanitizeString(values.category, 100) : null,
      lostDate: values.itemDate,
      contactPhone: values.contactPhone ? sanitizeString(values.contactPhone, 50) : null,
    });
    await auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      entity: 'lost_item',
      entityId: id,
      details: { title: values.title },
      ip: req.ip,
    });
    return success(res, { id, type: 'lost' }, 'Lost item reported', 201);
  } catch (e) {
    return next(e);
  }
}

async function reportFound(req, res, next) {
  try {
    const { errors, values } = validateItemReport(req.body, 'found');
    if (Object.keys(errors).length) {
      return error(res, 'Validation failed', 422, 'VALIDATION_ERROR', errors);
    }
    const id = await itemService.createFound({
      userId: req.user.id,
      title: sanitizeString(values.title, 200),
      description: sanitizeString(values.description, 5000),
      location: sanitizeString(values.location, 255),
      category: values.category ? sanitizeString(values.category, 100) : null,
      foundDate: values.itemDate,
      contactPhone: values.contactPhone ? sanitizeString(values.contactPhone, 50) : null,
    });
    await auditService.log({
      userId: req.user.id,
      action: 'CREATE',
      entity: 'found_item',
      entityId: id,
      details: { title: values.title },
      ip: req.ip,
    });
    return success(res, { id, type: 'found' }, 'Found item reported', 201);
  } catch (e) {
    return next(e);
  }
}

async function listItems(req, res, next) {
  try {
    const { q, type, status, page, pageSize } = req.query;
    let normalizedType = type ? String(type).toLowerCase() : undefined;
    if (normalizedType === 'all') normalizedType = undefined;
    if (normalizedType && !['lost', 'found'].includes(normalizedType)) {
      normalizedType = undefined;
    }
    const { items, total } = await itemService.listItems({
      q: q ? String(q).trim() : '',
      type: normalizedType,
      status: status ? String(status).toLowerCase() : undefined,
      page,
      pageSize,
    });
    return success(res, {
      items,
      page: Math.max(Number(page) || 1, 1),
      pageSize: Math.min(Math.max(Number(pageSize) || 10, 1), 100),
      total,
    });
  } catch (e) {
    return next(e);
  }
}

async function getItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    const itemType = req.query.type ? String(req.query.type).toLowerCase() : '';
    if (!id || !['lost', 'found'].includes(itemType)) {
      return error(res, 'Valid id and type query (lost|found) required', 400, 'BAD_REQUEST');
    }
    const item = await itemService.getItem(itemType, id);
    if (!item) return error(res, 'Item not found', 404, 'NOT_FOUND');
    return success(res, { item });
  } catch (e) {
    return next(e);
  }
}

async function updateItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    const itemType = req.query.type ? String(req.query.type).toLowerCase() : '';
    if (!id || !['lost', 'found'].includes(itemType)) {
      return error(res, 'Valid id and type query required', 400, 'BAD_REQUEST');
    }
    const { errors, values } = validateItemUpdate(req.body);
    if (Object.keys(errors).length) {
      return error(res, 'Validation failed', 422, 'VALIDATION_ERROR', errors);
    }
    const patch = {};
    if (values.title !== undefined) patch.title = sanitizeString(values.title, 200);
    if (values.description !== undefined)
      patch.description = sanitizeString(values.description, 5000);
    if (values.location !== undefined) patch.location = sanitizeString(values.location, 255);
    if (values.status !== undefined) patch.status = values.status;

    if (Object.keys(patch).length === 0) {
      return error(res, 'No valid fields to update', 422, 'VALIDATION_ERROR');
    }

    const affected = await itemService.updateItem(itemType, id, req.user.id, patch);
    if (!affected) {
      return error(res, 'Item not found or forbidden', 404, 'NOT_FOUND');
    }
    await auditService.log({
      userId: req.user.id,
      action: 'UPDATE',
      entity: `${itemType}_item`,
      entityId: id,
      details: patch,
      ip: req.ip,
    });
    return success(res, { id, type: itemType }, 'Updated');
  } catch (e) {
    return next(e);
  }
}

async function deleteItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    const itemType = req.query.type ? String(req.query.type).toLowerCase() : '';
    if (!id || !['lost', 'found'].includes(itemType)) {
      return error(res, 'Valid id and type query required', 400, 'BAD_REQUEST');
    }
    const affected = await itemService.deleteItem(itemType, id, req.user.id);
    if (!affected) {
      return error(res, 'Item not found or forbidden', 404, 'NOT_FOUND');
    }
    await auditService.log({
      userId: req.user.id,
      action: 'DELETE',
      entity: `${itemType}_item`,
      entityId: id,
      ip: req.ip,
    });
    return success(res, { id, type: itemType }, 'Deleted');
  } catch (e) {
    return next(e);
  }
}

async function contactOwner(req, res, next) {
  try {
    const { errors, values } = validateContact(req.body);
    if (Object.keys(errors).length) {
      return error(res, 'Validation failed', 422, 'VALIDATION_ERROR', errors);
    }
    const ownerId = await itemService.getOwnerId(values.itemType, values.itemId);
    if (!ownerId) return error(res, 'Item not found', 404, 'NOT_FOUND');
    if (ownerId === req.user.id) {
      return error(res, 'Cannot contact yourself', 400, 'INVALID');
    }
    const contactId = await itemService.createContact({
      itemType: values.itemType,
      itemId: values.itemId,
      fromUserId: req.user.id,
      toUserId: ownerId,
      message: sanitizeString(values.message, 2000),
      contactEmail: values.contactEmail,
    });
    await auditService.log({
      userId: req.user.id,
      action: 'CONTACT',
      entity: 'item_contact',
      entityId: contactId,
      details: { itemType: values.itemType, itemId: values.itemId },
      ip: req.ip,
    });
    return success(res, { contactId }, 'Message sent', 201);
  } catch (e) {
    return next(e);
  }
}

async function myItems(req, res, next) {
  try {
    const data = await itemService.listMyItems(req.user.id);
    return success(res, data);
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  reportLost,
  reportFound,
  listItems,
  getItem,
  updateItem,
  deleteItem,
  contactOwner,
  myItems,
};
