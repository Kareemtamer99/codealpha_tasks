const Inventory = require('../models/Inventory');
const { invalidateCache } = require('../middlewares/cache');

const CACHE_PREFIX = 'cache';

const getAll = async () => {
  return Inventory.find().sort({ itemName: 1 });
};

const create = async (data) => {
  const item = await Inventory.create(data);
  await invalidateCache(CACHE_PREFIX);
  return item;
};

const update = async (id, data) => {
  const item = await Inventory.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    const error = new Error('Inventory item not found');
    error.statusCode = 404;
    throw error;
  }
  await invalidateCache(CACHE_PREFIX);
  return item;
};

const remove = async (id) => {
  const item = await Inventory.findByIdAndDelete(id);
  if (!item) {
    const error = new Error('Inventory item not found');
    error.statusCode = 404;
    throw error;
  }
  await invalidateCache(CACHE_PREFIX);
  return item;
};

module.exports = { getAll, create, update, remove };
