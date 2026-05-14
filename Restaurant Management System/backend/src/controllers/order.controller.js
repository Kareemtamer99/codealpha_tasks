const orderService = require('../services/order.service');

const getAll = async (req, res, next) => {
  try {
    const orders = await orderService.getAll(req.query);
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const order = await orderService.getById(req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const order = await orderService.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await orderService.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, updateStatus, remove };
