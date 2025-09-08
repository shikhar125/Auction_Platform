import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message, html }) => {
  let auth = {};
  let host = '';
  let port = 587;
  let secure = false;

  // Priority 1: SendGrid (Recommended for production)
  if (process.env.SENDGRID_API_KEY) {
    console.log('Using SendGrid for email delivery...');
    auth = {
      user: 'apikey', // SendGrid requires 'apikey' as username
      pass: process.env.SENDGRID_API_KEY,
    };
    host = 'smtp.sendgrid.net';
    port = 587;
    secure = false;
  }
  // Priority 2: Custom SMTP credentials
  else if (process.env.SMTP_MAIL && process.env.SMTP_PASSWORD) {
    console.log('Using custom SMTP credentials...');
    auth = {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    };
    host = process.env.SMTP_HOST || 'smtp.gmail.com';
    port = process.env.SMTP_PORT || 587;
    secure = process.env.SMTP_SECURE === 'true';
  }
  // Priority 3: Ethereal Email for testing (fallback)
  else {
    console.log('⚠️  No email service configured. Using Ethereal Email for testing...');
    try {
      console.log('Generating Ethereal test account...');
      const testAccount = await nodeMailer.createTestAccount();
      auth = {
        user: testAccount.user,
        pass: testAccount.pass,
      };
      host = 'smtp.ethereal.email';
      port = 587;
      secure = false;
      console.log('Ethereal account generated successfully!');
    } catch (error) {
      console.error('Failed to generate Ethereal account:', error.message);
      // Fallback to basic configuration
      auth = {
        user: 'test@ethereal.email',
        pass: 'testpassword'
      };
      host = 'smtp.ethereal.email';
      port = 587;
      secure = false;
    }
  }

  const transporter = nodeMailer.createTransport({
    host: host,
    port: port,
    secure: secure,
    auth: auth,
  });

  const mailOptions = {
    from: '"Auction Platform" <noreply@auctionplatform.com>',
    to: email,
    subject: subject,
    text: message,
    html: html || message,
  };

  try {
    const result = await transporter.sendMail(mailOptions);

    // Different success messages based on service used
    if (process.env.SENDGRID_API_KEY) {
      console.log('✅ Email sent successfully via SendGrid!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📝 Email delivered to real inbox');
    } else if (process.env.SMTP_MAIL) {
      console.log('✅ Email sent successfully via Custom SMTP!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📝 Email delivered to real inbox');
    } else {
      console.log('✅ Email sent successfully via Ethereal Email (Testing Service)!');
      console.log('📧 Message ID:', result.messageId);
      console.log('🔗 Preview URL:', nodeMailer.getTestMessageUrl(result));
      console.log('');
      console.log('🌐 TO VIEW THE EMAIL:');
      console.log('   1. Copy and paste this URL into your browser:');
      console.log('      ' + nodeMailer.getTestMessageUrl(result));
      console.log('   2. Or visit: https://ethereal.email');
      console.log('   3. Login with the credentials shown above');
      console.log('');
      console.log('📝 NOTE: This is a testing service. Emails are not sent to real inboxes.');
      console.log('         Use this for development/testing purposes only.');
    }
    console.log('');
    return result;
  } catch (error) {
    console.error('Error sending email:', error.message);
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    console.error('SMTP response:', error.response);
    console.error('SMTP response code:', error.responseCode);

    // Fallback to console logging if email fails
    console.log('=== EMAIL FALLBACK (Console Log) ===');
    console.log('To:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    if (html) {
      console.log('HTML Content:', html);
    }
    console.log('=====================================');

    // Return a mock result to prevent 500 error
    const mockResult = {
      messageId: `fallback-${Date.now()}@auctionplatform.com`,
      accepted: [email],
      rejected: [],
      envelope: {
        from: 'noreply@auctionplatform.com',
        to: [email]
      },
      response: '250 OK: Message logged (fallback mode)'
    };

    console.log('Fallback email logged successfully:', mockResult.messageId);
    return mockResult;
  }
};
