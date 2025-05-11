'use strict';
const path = require('path');
const mongoose = require('mongoose');
require('../dal/dto/User');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.DB ;

const run = async () => {
    console.log(MONGO_URI);
    await mongoose.connect(MONGO_URI);

    const User = mongoose.model('User');

    const hashedPassword = bcrypt.hashSync('SecurePass123', 10);

    // Create Admin User
    const exists = await User.findOne({ email: 'admin@admin.com' });
    if (!exists) {
        await User.create({
            username: 'admin',
            email: 'admin@admin.com',
            password: hashedPassword,
            active:"true",
            firstName: 'Admin',
            lastName: 'Admin',
            type: 'admin'
        });
        console.log('Admin user created');
    } else {
        console.log(' Admin user already exists');
    }

    await mongoose.disconnect();
};

run().catch(err => {
    console.error(' Seed failed', err);
    process.exit(1);
});
