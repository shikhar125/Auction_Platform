import nodemailer from 'nodemailer';

// Generate Ethereal email credentials for testing
export const generateEtherealCredentials = async () => {
  try {
    // Create a test account
    const testAccount = await nodemailer.createTestAccount();

    console.log('=== ETHEREAL EMAIL CREDENTIALS GENERATED ===');
    console.log('Email:', testAccount.user);
    console.log('Password:', testAccount.pass);
    console.log('SMTP Host:', 'smtp.ethereal.email');
    console.log('SMTP Port:', 587);
    console.log('===========================================');
    console.log('Use these credentials in your .env file:');
    console.log(`SMTP_HOST=smtp.ethereal.email`);
    console.log(`SMTP_PORT=587`);
    console.log(`SMTP_SERVICE=ethereal`);
    console.log(`SMTP_MAIL=${testAccount.user}`);
    console.log(`SMTP_PASSWORD=${testAccount.pass}`);
    console.log('===========================================');

    return {
      user: testAccount.user,
      pass: testAccount.pass,
      host: 'smtp.ethereal.email',
      port: 587
    };
  } catch (error) {
    console.error('Error generating Ethereal credentials:', error.message);
    return null;
  }
};

// If run directly, generate credentials
if (import.meta.url === `file://${process.argv[1]}`) {
  generateEtherealCredentials();
}
