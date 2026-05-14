const Order = require('../models/Order');
const Table = require('../models/Table');
const Inventory = require('../models/Inventory');
const MenuItem = require('../models/MenuItem');

const getStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    todayOrders,
    totalRevenue,
    activeTables,
    totalTables,
    lowStockItems,
    totalMenuItems,
    recentOrders,
    pendingOrders,
  ] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: { $ne: 'cancelled' },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Table.countDocuments({ status: { $in: ['occupied', 'reserved'] } }),
    Table.countDocuments(),
    Inventory.countDocuments({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
    }),
    MenuItem.countDocuments({ available: true }),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Order.countDocuments({ status: 'pending' }),
  ]);

  return {
    todayOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    activeTables,
    totalTables,
    lowStockItems,
    totalMenuItems,
    pendingOrders,
    recentOrders,
  };
};

module.exports = { getStats };
