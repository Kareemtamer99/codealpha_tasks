const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');
const Inventory = require('./models/Inventory');
const Order = require('./models/Order');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');

    await Promise.all([
      User.deleteMany(),
      MenuItem.deleteMany(),
      Table.deleteMany(),
      Inventory.deleteMany(),
      Order.deleteMany(),
    ]);

    // Seed admin user
    console.log('👤 Creating admin user...');
    await User.create({
      name: 'Admin',
      email: 'admin@rms.com',
      password: 'admin123',
      role: 'admin',
    });

    // Seed staff user
    await User.create({
      name: 'Staff Member',
      email: 'staff@rms.com',
      password: 'staff123',
      role: 'staff',
    });

    // Seed menu items
    console.log('🍽️  Creating menu items...');
    const menuItems = await MenuItem.insertMany([
      { name: 'Bruschetta', description: 'Toasted bread with tomatoes, garlic, and basil', price: 8.99, category: 'appetizer', available: true },
      { name: 'Caesar Salad', description: 'Fresh romaine lettuce with caesar dressing and croutons', price: 10.99, category: 'appetizer', available: true },
      { name: 'Spring Rolls', description: 'Crispy vegetable spring rolls with sweet chili sauce', price: 7.99, category: 'appetizer', available: true },
      { name: 'Grilled Salmon', description: 'Atlantic salmon with lemon butter sauce and asparagus', price: 24.99, category: 'main', available: true },
      { name: 'Beef Steak', description: 'Premium ribeye steak cooked to perfection with sides', price: 29.99, category: 'main', available: true },
      { name: 'Chicken Parmesan', description: 'Breaded chicken breast with marinara sauce and mozzarella', price: 18.99, category: 'main', available: true },
      { name: 'Pasta Carbonara', description: 'Spaghetti with creamy egg sauce, bacon, and parmesan', price: 16.99, category: 'main', available: true },
      { name: 'Veggie Burger', description: 'Plant-based patty with lettuce, tomato, and special sauce', price: 14.99, category: 'main', available: true },
      { name: 'French Fries', description: 'Crispy golden fries with seasoning', price: 5.99, category: 'side', available: true },
      { name: 'Garlic Bread', description: 'Freshly baked bread with garlic butter', price: 4.99, category: 'side', available: true },
      { name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: 9.99, category: 'dessert', available: true },
      { name: 'Chocolate Lava Cake', description: 'Rich chocolate cake with molten center', price: 11.99, category: 'dessert', available: true },
      { name: 'Cheesecake', description: 'New York style cheesecake with berry compote', price: 10.99, category: 'dessert', available: true },
      { name: 'Espresso', description: 'Double shot espresso', price: 3.99, category: 'drink', available: true },
      { name: 'Fresh Lemonade', description: 'Freshly squeezed lemonade with mint', price: 4.99, category: 'drink', available: true },
      { name: 'Iced Tea', description: 'Chilled black tea with lemon', price: 3.49, category: 'drink', available: true },
      { name: 'Sparkling Water', description: 'San Pellegrino sparkling water', price: 2.99, category: 'drink', available: true },
    ]);

    // Seed tables
    console.log('🪑 Creating tables...');
    await Table.insertMany([
      { number: 1, capacity: 2, status: 'available' },
      { number: 2, capacity: 2, status: 'available' },
      { number: 3, capacity: 4, status: 'occupied' },
      { number: 4, capacity: 4, status: 'available' },
      { number: 5, capacity: 6, status: 'reserved', reservedBy: 'John Doe', reservedAt: new Date() },
      { number: 6, capacity: 6, status: 'available' },
      { number: 7, capacity: 8, status: 'available' },
      { number: 8, capacity: 8, status: 'occupied' },
      { number: 9, capacity: 4, status: 'available' },
      { number: 10, capacity: 10, status: 'available' },
    ]);

    // Seed inventory
    console.log('📦 Creating inventory items...');
    await Inventory.insertMany([
      { itemName: 'Tomatoes', quantity: 50, unit: 'kg', lowStockThreshold: 10 },
      { itemName: 'Chicken Breast', quantity: 30, unit: 'kg', lowStockThreshold: 8 },
      { itemName: 'Salmon Fillet', quantity: 15, unit: 'kg', lowStockThreshold: 5 },
      { itemName: 'Olive Oil', quantity: 10, unit: 'L', lowStockThreshold: 3 },
      { itemName: 'Flour', quantity: 25, unit: 'kg', lowStockThreshold: 5 },
      { itemName: 'Mozzarella', quantity: 8, unit: 'kg', lowStockThreshold: 3 },
      { itemName: 'Coffee Beans', quantity: 5, unit: 'kg', lowStockThreshold: 2 },
      { itemName: 'Lemons', quantity: 3, unit: 'kg', lowStockThreshold: 5 },
      { itemName: 'Beef Ribeye', quantity: 20, unit: 'kg', lowStockThreshold: 5 },
      { itemName: 'Pasta', quantity: 15, unit: 'boxes', lowStockThreshold: 4 },
      { itemName: 'Eggs', quantity: 60, unit: 'pcs', lowStockThreshold: 20 },
      { itemName: 'Butter', quantity: 4, unit: 'kg', lowStockThreshold: 2 },
    ]);

    // Seed some orders
    console.log('📝 Creating sample orders...');
    await Order.insertMany([
      {
        items: [
          { menuItem: menuItems[0]._id, name: 'Bruschetta', price: 8.99, quantity: 2 },
          { menuItem: menuItems[3]._id, name: 'Grilled Salmon', price: 24.99, quantity: 1 },
        ],
        totalPrice: 42.97,
        status: 'served',
        tableNumber: 3,
        customerName: 'Alice Johnson',
      },
      {
        items: [
          { menuItem: menuItems[4]._id, name: 'Beef Steak', price: 29.99, quantity: 2 },
          { menuItem: menuItems[8]._id, name: 'French Fries', price: 5.99, quantity: 2 },
          { menuItem: menuItems[14]._id, name: 'Fresh Lemonade', price: 4.99, quantity: 2 },
        ],
        totalPrice: 81.94,
        status: 'preparing',
        tableNumber: 8,
        customerName: 'Bob Smith',
      },
      {
        items: [
          { menuItem: menuItems[6]._id, name: 'Pasta Carbonara', price: 16.99, quantity: 1 },
          { menuItem: menuItems[10]._id, name: 'Tiramisu', price: 9.99, quantity: 1 },
          { menuItem: menuItems[13]._id, name: 'Espresso', price: 3.99, quantity: 2 },
        ],
        totalPrice: 34.96,
        status: 'pending',
        tableNumber: 5,
        customerName: 'John Doe',
      },
    ]);

    console.log('\n✅ Database seeded successfully!');
    console.log('   Admin login: admin@rms.com / admin123');
    console.log('   Staff login: staff@rms.com / staff123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
