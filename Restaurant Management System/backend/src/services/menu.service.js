const MenuItem = require('../models/MenuItem');
const { invalidateCache } = require('../middlewares/cache');

const CACHE_PREFIX = 'cache';

const getAll = async (query = {}) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.available !== undefined) filter.available = query.available === 'true';

  return MenuItem.find(filter).sort({ category: 1, name: 1 });
};

const getById = async (id) => {
  const item = await MenuItem.findById(id);
  if (!item) {
    const error = new Error('Menu item not found');
    error.statusCode = 404;
    throw error;
  }
  return item;
};

const create = async (data) => {
  const item = await MenuItem.create(data);
  await invalidateCache(CACHE_PREFIX);
  return item;
};

const update = async (id, data) => {
  const item = await MenuItem.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    const error = new Error('Menu item not found');
    error.statusCode = 404;
    throw error;
  }
  await invalidateCache(CACHE_PREFIX);
  return item;
};

const remove = async (id) => {
  const item = await MenuItem.findByIdAndDelete(id);
  if (!item) {
    const error = new Error('Menu item not found');
    error.statusCode = 404;
    throw error;
  }
  await invalidateCache(CACHE_PREFIX);
  return item;
};

module.exports = { getAll, getById, create, update, remove };
