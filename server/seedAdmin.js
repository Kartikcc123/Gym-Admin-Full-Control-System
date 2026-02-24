import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load the .env file so we can connect to the database
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database...');

    // Check if the admin already exists so we don't create duplicates
    const adminExists = await User.findOne({ email: 'admin@nextgenz.com' });

    if (adminExists) {
      console.log('Admin account already exists! You are good to go.');
      process.exit();
    }

    // Create the master admin account
    const admin = await User.create({
      name: 'Kartik Agarwal',
      email: 'admin@nextgenz.com',
      password: 'adminpassword123', // Your User model will automatically encrypt this!
      role: 'Admin',
    });

    console.log('✅ Master Admin Account Created Successfully!');
    console.log('-------------------------------------------');
    console.log('Email: admin@nextgenz.com');
    console.log('Password: adminpassword123');
    console.log('-------------------------------------------');

    process.exit();
  } catch (error) {
    console.error(`Error creating admin: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();