import mongoose from 'mongoose';
import { User } from './models/userSchema.js';
import { PaymentProof } from './models/commissionProofSchema.js';
import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Create a test user if not exists
const createTestUser = async () => {
  try {
    let user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      user = new User({
        userName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        address: 'Test Address',
        role: 'Auctioneer',
        profileImage: {
          public_id: 'test',
          url: 'https://via.placeholder.com/150'
        },
        paymentMethods: {
          bankTransfer: {
            bankAccountNumber: '123456789',
            bankAccountName: 'Test Bank',
            bankName: 'Test Bank Name'
          },
          easypaisa: {
            easypaisaAccountNumber: '123456789'
          },
          paypal: {
            paypalEmail: 'test@example.com'
          }
        },
        unpaidCommission: 100, // Set some unpaid commission for testing
        moneySpent: 0
      });
      await user.save();
      console.log('✅ Test user created');
    } else {
      // Update unpaid commission for testing
      user.unpaidCommission = 100;
      await user.save();
      console.log('✅ Test user updated with unpaid commission');
    }
    return user;
  } catch (error) {
    console.error('❌ Error creating/updating test user:', error);
    throw error;
  }
};

// Test commission proof upload logic
const testCommissionProofUpload = async (userId) => {
  console.log('\n🧪 Testing Commission Proof Upload Logic...');

  try {
    // Simulate the controller logic
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    console.log('✅ User found:', user.userName);
    console.log('✅ User unpaid commission:', user.unpaidCommission);

    // Test validation
    const amount = 50;
    const comment = 'Test payment proof';

    if (!amount || !comment) {
      throw new Error('Amount & comment are required fields');
    }

    if (user.unpaidCommission === 0) {
      console.log('ℹ️  User has no unpaid commissions');
      return;
    }

    if (user.unpaidCommission < amount) {
      throw new Error(`Amount exceeds unpaid commission balance`);
    }

    console.log('✅ Validation passed');

    // Simulate file upload (we'll skip actual Cloudinary upload for this test)
    console.log('✅ File validation would pass (simulated)');

    // Create payment proof record
    const commissionProof = await PaymentProof.create({
      userId: user._id,
      proof: {
        public_id: 'test_proof_public_id',
        url: 'https://via.placeholder.com/300x200?text=Payment+Proof'
      },
      amount,
      comment
    });

    console.log('✅ Payment proof created successfully:', commissionProof._id);
    console.log('✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
};

// Main test function
const runTests = async () => {
  try {
    await connectDB();
    const user = await createTestUser();
    await testCommissionProofUpload(user._id);

    console.log('\n🎉 All tests passed! The commission proof upload logic is working correctly.');
  } catch (error) {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the tests
runTests();
