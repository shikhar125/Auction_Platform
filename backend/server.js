import dotenv from "dotenv";   // ✅ import dotenv first
dotenv.config();               // ✅ load environment variables from .env

import app from "./app.js";
import cloudinary from "cloudinary";

// Validate required environment variables
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'JWT_SECRET_KEY',
  'JWT_EXPIRE',
  'MONGO_URI'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  console.error('👉 Please set the following in your .env file or Render env vars:');
  missingVars.forEach(varName => console.error(`- ${varName}`));
  process.exit(1);
}

// SMTP configuration (optional)
const smtpVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_MAIL', 'SMTP_PASSWORD'];
const smtpConfigured = smtpVars.every(varName => process.env[varName]);

if (smtpConfigured) {
  console.log('✅ SMTP configuration found - emails will be sent to real inboxes');
} else {
  console.log('⚠️  SMTP configuration not found - emails will use Ethereal testing service');
  console.log('   To enable real email sending, add these to your .env file:');
  smtpVars.forEach(varName => {
    if (!process.env[varName]) {
      console.log(`   - ${varName}`);
    }
  });
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
