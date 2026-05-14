const inventoryService = require('../services/inventory.service');

const getAll = async (req, res, next) => {
  try {
    const items = await inventoryService.getAll();
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const item = await inventoryService.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const item = await inventoryService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await inventoryService.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Inventory item deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, update, remove };
