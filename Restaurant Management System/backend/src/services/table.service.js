const Table = require('../models/Table');
const { invalidateCache } = require('../middlewares/cache');

const CACHE_PREFIX = 'cache';

const getAll = async () => {
  return Table.find().sort({ number: 1 });
};

const create = async (data) => {
  const table = await Table.create(data);
  await invalidateCache(CACHE_PREFIX);
  return table;
};

const update = async (id, data) => {
  const table = await Table.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!table) {
    const error = new Error('Table not found');
    error.statusCode = 404;
    throw error;
  }
  await invalidateCache(CACHE_PREFIX);
  return table;
};

const reserve = async (id, reservedBy) => {
  const table = await Table.findById(id);
  if (!table) {
    const error = new Error('Table not found');
    error.statusCode = 404;
    throw error;
  }
  if (table.status !== 'available') {
    const error = new Error(`Table is currently ${table.status}`);
    error.statusCode = 400;
    throw error;
  }

  table.status = 'reserved';
  table.reservedBy = reservedBy;
  table.reservedAt = new Date();
  await table.save();
  await invalidateCache(CACHE_PREFIX);
  return table;
};

const release = async (id) => {
  const table = await Table.findById(id);
  if (!table) {
    const error = new Error('Table not found');
    error.statusCode = 404;
    throw error;
  }

  table.status = 'available';
  table.reservedBy = '';
  table.reservedAt = null;
  await table.save();
  await invalidateCache(CACHE_PREFIX);
  return table;
};

module.exports = { getAll, create, update, reserve, release };
