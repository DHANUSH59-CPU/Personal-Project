import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import Category from '../models/Category.js';
import { createSlug } from '../utils/helpers.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dhanushjoelucky@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

const categories = [
  { name: 'Regular Pads', description: 'Everyday comfort pads for light to medium flow' },
  { name: 'Overnight Pads', description: 'Extra-long pads designed for overnight protection' },
  { name: 'Organic Pads', description: 'Made with 100% certified organic cotton' },
  { name: 'Panty Liners', description: 'Ultra-thin liners for daily freshness' },
  { name: 'Maternity Pads', description: 'Extra absorbent pads for postpartum care' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Seed Admin
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save({ validateBeforeSave: false });
        console.log(`🔄 Updated ${ADMIN_EMAIL} to admin role`);
      } else {
        console.log(`✅ Admin already exists: ${ADMIN_EMAIL}`);
      }
    } else {
      await User.create({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log(`🎉 Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    }

    // Seed Categories
    for (const cat of categories) {
      const slug = createSlug(cat.name);
      const exists = await Category.findOne({ slug });
      if (!exists) {
        await Category.create({ name: cat.name, slug, description: cat.description });
        console.log(`📁 Category created: ${cat.name}`);
      } else {
        console.log(`✅ Category exists: ${cat.name}`);
      }
    }

    console.log('\n🎉 Seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDB();
