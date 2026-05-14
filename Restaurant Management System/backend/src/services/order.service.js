const Order = require('../models/Order');
const { invalidateCache } = require('../middlewares/cache');

const CACHE_PREFIX = 'cache';

const getAll = async (query = {}) => {
  const filter = {};
  if (query.status) filter.status = query.status;

  return Order.find(filter).sort({ createdAt: -1 }).limit(100);
};

const getById = async (id) => {
  const order = await Order.findById(id);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }
  return order;
};

const create = async (data) => {
  // Calculate total price from items
  const totalPrice = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({ ...data, totalPrice });
  await invalidateCache(CACHE_PREFIX);
  return order;
};

const updateStatus = async (id, status) => {
  const validTransitions = {
    pending: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['served', 'cancelled'],
    served: [],
    cancelled: [],
  };

  const order = await Order.findById(id);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  if (!validTransitions[order.status]?.includes(status)) {
    const error = new Error(
      `Cannot transition from '${order.status}' to '${status}'`
    );
    error.statusCode = 400;
    throw error;
  }

  order.status = status;
  await order.save();
  await invalidateCache(CACHE_PREFIX);
  return order;
};

const remove = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }
  await invalidateCache(CACHE_PREFIX);
  return order;
};

module.exports = { getAll, getById, create, updateStatus, remove };
