
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string || 'mongodb://localhost:27017/halkabite');
        console.log('✅ MongoDB Connected');

        const adminEmail = 'admin@halkabite.com';
        const adminPass = 'admin123';

        let admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            admin = await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: adminPass,
                role: 'admin',
                phone: '01700000000',
                isVerified: true
            });
            console.log('✅ Admin user created');
        } else {
            console.log('ℹ️  Admin already exists');
            // Update password just in case
            admin.password = adminPass;
            await admin.save();
            console.log('✅ Admin password reset to default');
        }

        console.log('   Email:', adminEmail);
        console.log('   Password:', adminPass);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createAdmin();
