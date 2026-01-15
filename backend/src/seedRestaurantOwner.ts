import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Restaurant, User } from './models';

dotenv.config();

const seedRestaurantOwner = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('✅ MongoDB Connected');

        // Create or find restaurant owner user
        let owner = await User.findOne({ email: 'owner@halkabite.com' });

        if (!owner) {
            owner = await User.create({
                name: 'Restaurant Owner',
                email: 'owner@halkabite.com',
                password: 'password123', // Will be hashed by pre-save hook
                role: 'restaurant',
                phone: '01711223344',
                isVerified: true
            });
            console.log('✅ Restaurant owner user created');
            console.log('   Email: owner@halkabite.com');
            console.log('   Password: password123');
        } else {
            console.log('ℹ️  Restaurant owner already exists');
        }

        // Check if restaurant already exists for this owner
        const existingRestaurant = await Restaurant.findOne({ owner: owner._id });

        if (existingRestaurant) {
            console.log('ℹ️  Restaurant already exists for this owner:', existingRestaurant.name);
        } else {
            // Create restaurant for the owner
            const restaurant = await Restaurant.create({
                name: 'Tasty Bites Restaurant',
                description: 'Delicious food made with love. Specializing in Bengali and Continental cuisine.',
                address: {
                    street: '123 Food Street, Banani',
                    city: 'Dhaka',
                    state: 'Dhaka Division',
                    zipCode: '1213',
                    country: 'Bangladesh',
                    coordinates: {
                        lat: 23.7937,
                        lng: 90.4066
                    }
                },
                phone: '01711223344',
                email: 'tasty@halkabite.com',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
                coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
                cuisine: ['Bengali', 'Fast Food', 'Continental'],
                rating: 4.5,
                reviewCount: 120,
                deliveryTime: '30-45 min',
                deliveryFee: 50,
                minimumOrder: 100,
                isOpen: true,
                isActive: true,
                openingHours: [
                    { day: 'Monday', open: '09:00', close: '23:00', isClosed: false },
                    { day: 'Tuesday', open: '09:00', close: '23:00', isClosed: false },
                    { day: 'Wednesday', open: '09:00', close: '23:00', isClosed: false },
                    { day: 'Thursday', open: '09:00', close: '23:00', isClosed: false },
                    { day: 'Friday', open: '09:00', close: '23:00', isClosed: false },
                    { day: 'Saturday', open: '09:00', close: '23:00', isClosed: false },
                    { day: 'Sunday', open: '09:00', close: '23:00', isClosed: false }
                ],
                owner: owner._id
            });

            console.log('✅ Restaurant created successfully!');
            console.log('   Name:', restaurant.name);
            console.log('   Owner:', owner.name);
            console.log('');
            console.log('🎉 You can now login with:');
            console.log('   Email: owner@halkabite.com');
            console.log('   Password: password123');
            console.log('   Role: restaurant');
        }

        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error seeding restaurant owner:', error.message);
        process.exit(1);
    }
};

seedRestaurantOwner();
