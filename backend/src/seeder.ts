import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Event from './models/eventModel.js';
import Registration from './models/registrationModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await Registration.deleteMany();
    await Event.deleteMany();
    await User.deleteMany();

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin',
    });

    // Create Regular User
    await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      role: 'User',
    });

    // Create Sample Events
    const events = [
      {
        title: 'Tech Conference 2026',
        description: 'A deep dive into the latest in AI, Cloud, and Web development.',
        date: new Date('2026-06-15'),
        location: 'Silicon Valley, CA',
        capacity: 500,
        organizer: admin._id,
      },
      {
        title: 'Music Festival',
        description: 'An outdoor festival featuring top artists from around the world.',
        date: new Date('2026-07-20'),
        location: 'Austin, TX',
        capacity: 1000,
        organizer: admin._id,
      },
      {
        title: 'Startup Pitch Night',
        description: 'Watch the next generation of entrepreneurs pitch their ideas.',
        date: new Date('2026-08-05'),
        location: 'New York, NY',
        capacity: 100,
        organizer: admin._id,
      },
      {
        title: 'Design Workshop',
        description: 'Hands-on workshop for UI/UX designers focusing on accessibility.',
        date: new Date('2026-09-12'),
        location: 'London, UK',
        capacity: 50,
        organizer: admin._id,
      },
    ];

    await Event.insertMany(events);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error}`);
    process.exit(1);
  }
};

seedData();
