import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/user.model';
import Project from './models/project.model';
import Task from './models/task.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/electro-pi-db';

const seedDatabase = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        console.log('Clearing existing data...');
        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();

        console.log('Seeding Admin and Member users...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'Admin'
        });

        const memberUser = await User.create({
            name: 'Member User',
            email: 'member@test.com',
            password: hashedPassword,
            role: 'Member'
        });

        console.log('Seeding Projects...');
        const projects = await Project.insertMany([
            {
                title: 'E-Commerce Website',
                description: 'Build a fullstack e-commerce app',
                status: 'Active',
                user: adminUser._id
            },
            {
                title: 'Mobile App API',
                description: 'Develop backend endpoints for the mobile team',
                status: 'Completed',
                user: memberUser._id
            },
            {
                title: 'Internal Analytics Dashboard',
                description: 'Data visualization tool for marketing',
                status: 'Archived',
                user: adminUser._id
            },
            {
                title: 'Marketing Landing Page',
                description: 'SEO optimized landing page for new campaign',
                status: 'Active',
                user: memberUser._id
            }
        ]);

        console.log('Seeding Tasks...');

        const getOffsetDate = (days: number) => {
            const date = new Date();
            date.setDate(date.getDate() + days);
            return date;
        };

        await Task.insertMany([
            { title: 'Design Database Schema', description: 'Create ERD and Mongoose models', status: 'Done', priority: 'High', dueDate: getOffsetDate(-5), project: projects[0]._id },
            { title: 'Setup JWT Auth', description: 'Implement register, login, and refresh routes', status: 'In Progress', priority: 'High', dueDate: getOffsetDate(2), project: projects[0]._id },
            { title: 'Payment Gateway Integration', description: 'Integrate Stripe API', status: 'Pending', priority: 'High', dueDate: getOffsetDate(10), project: projects[0]._id },
            { title: 'Product Listing UI', description: 'Frontend cards for products', status: 'Pending', priority: 'Medium', dueDate: getOffsetDate(15), project: projects[0]._id },
            { title: 'Shopping Cart Logic', description: 'Redux state for cart', status: 'Pending', priority: 'Low', dueDate: getOffsetDate(20), project: projects[0]._id },

            { title: 'Setup Express Server', description: 'Initialize project and TS config', status: 'Done', priority: 'Medium', dueDate: getOffsetDate(-10), project: projects[1]._id },
            { title: 'User Profile Endpoint', description: 'GET /api/users/profile', status: 'Done', priority: 'Low', dueDate: getOffsetDate(-2), project: projects[1]._id },
            { title: 'Push Notifications', description: 'Firebase integration', status: 'Done', priority: 'High', dueDate: getOffsetDate(-1), project: projects[1]._id },

            { title: 'Gather Requirements', description: 'Meeting with marketing team', status: 'Done', priority: 'High', dueDate: getOffsetDate(-20), project: projects[2]._id },
            { title: 'Design Figma Prototypes', description: 'Wireframes for charts', status: 'In Progress', priority: 'Medium', dueDate: getOffsetDate(1), project: projects[2]._id },
            { title: 'Setup Chart.js', description: 'Install and configure chart library', status: 'Pending', priority: 'Low', dueDate: getOffsetDate(7), project: projects[2]._id },

            { title: 'Buy Domain Name', description: 'Purchase domain from Namecheap', status: 'Done', priority: 'High', dueDate: getOffsetDate(-3), project: projects[3]._id },
            { title: 'Write Copywriting', description: 'Draft text for hero section', status: 'In Progress', priority: 'Medium', dueDate: getOffsetDate(1), project: projects[3]._id },
            { title: 'SEO Optimization', description: 'Add meta tags and alt text', status: 'Pending', priority: 'Low', dueDate: getOffsetDate(4), project: projects[3]._id }
        ]);

        console.log('Database successfully seeded with 2 Users, 4 Projects, and 14 Tasks!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();