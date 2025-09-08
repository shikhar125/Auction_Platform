const fs = require('fs');
const path = require('path');

// Your generated JWT secret key
const JWT_SECRET_KEY = '8237f596089a6b19f0fbb46b5e3828d3fa6892b5fa68203f02649ca64ee7d3e32b86ebce7bff3ac744c3ea39438907a53855a2826991139b35a89ea2e8888ab9';

// Path to your .env file
const envPath = path.join(__dirname, 'backend', '.env');

try {
  // Read the existing .env file
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Check if JWT_SECRET_KEY already exists
  if (envContent.includes('JWT_SECRET_KEY=')) {
    // Update existing JWT_SECRET_KEY
    envContent = envContent.replace(
      /JWT_SECRET_KEY=.*/,
      `JWT_SECRET_KEY=${JWT_SECRET_KEY}`
    );
  } else {
    // Add JWT_SECRET_KEY to the .env file
    envContent += `\nJWT_SECRET_KEY=${JWT_SECRET_KEY}\n`;
  }
  
  // Ensure JWT_EXPIRE is set
  if (!envContent.includes('JWT_EXPIRE=')) {
    envContent += 'JWT_EXPIRE=7d\n';
  }
  
  // Ensure COOKIE_EXPIRE is set
  if (!envContent.includes('COOKIE_EXPIRE=')) {
    envContent += 'COOKIE_EXPIRE=7\n';
  }
  
  // Ensure Cloudinary configuration is set (with placeholder values)
  if (!envContent.includes('CLOUDINARY_CLOUD_NAME=')) {
    envContent += 'CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name\n';
  }
  
  if (!envContent.includes('CLOUDINARY_API_KEY=')) {
    envContent += 'CLOUDINARY_API_KEY=your_cloudinary_api_key\n';
  }
  
  if (!envContent.includes('CLOUDINARY_API_SECRET=')) {
    envContent += 'CLOUDINARY_API_SECRET=your_cloudinary_api_secret\n';
  }
  
  // Ensure PORT is set
  if (!envContent.includes('PORT=')) {
    envContent += 'PORT=5000\n';
  }
  
  // Ensure FRONTEND_URL is set
  if (!envContent.includes('FRONTEND_URL=')) {
    envContent += 'FRONTEND_URL=http://localhost:5173\n';
  }
  
  // Ensure DATABASE_URL is set
  if (!envContent.includes('DATABASE_URL=')) {
    envContent += 'DATABASE_URL=mongodb://localhost:27017/MERN_AUCTION_PLATFORM\n';
  }
  
  // Write the updated content back to the .env file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment variables updated successfully!');
  console.log('JWT_SECRET_KEY has been set to the generated secure key');
  console.log('\n⚠️  IMPORTANT: You need to configure Cloudinary credentials:');
  console.log('1. Sign up at https://cloudinary.com/');
  console.log('2. Go to your Dashboard');
  console.log('3. Update these values in backend/.env:');
  console.log('   - CLOUDINARY_CLOUD_NAME=your_actual_cloud_name');
  console.log('   - CLOUDINARY_API_KEY=your_actual_api_key');
  console.log('   - CLOUDINARY_API_SECRET=your_actual_api_secret');
  console.log('\n⚠️  Also ensure MongoDB is running on localhost:27017');
  
} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
  console.log('\nPlease manually add these lines to your backend/.env file:');
  console.log(`JWT_SECRET_KEY=${JWT_SECRET_KEY}`);
  console.log('JWT_EXPIRE=7d');
  console.log('COOKIE_EXPIRE=7');
  console.log('CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name');
  console.log('CLOUDINARY_API_KEY=your_cloudinary_api_key');
  console.log('CLOUDINARY_API_SECRET=your_cloudinary_api_secret');
  console.log('PORT=5000');
  console.log('FRONTEND_URL=http://localhost:5173');
  console.log('DATABASE_URL=mongodb://localhost:27017/MERN_AUCTION_PLATFORM');
}
