const tableService = require('../services/table.service');

const getAll = async (req, res, next) => {
  try {
    const tables = await tableService.getAll();
    res.status(200).json({ success: true, count: tables.length, data: tables });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const table = await tableService.create(req.body);
    res.status(201).json({ success: true, data: table });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const table = await tableService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: table });
  } catch (error) {
    next(error);
  }
};

const reserve = async (req, res, next) => {
  try {
    const table = await tableService.reserve(req.params.id, req.body.reservedBy);
    res.status(200).json({ success: true, data: table });
  } catch (error) {
    next(error);
  }
};

const release = async (req, res, next) => {
  try {
    const table = await tableService.release(req.params.id);
    res.status(200).json({ success: true, data: table });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, update, reserve, release };
