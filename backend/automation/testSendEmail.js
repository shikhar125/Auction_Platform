import dotenv from "dotenv";
dotenv.config();

import { sendEmail } from "../utils/sendEmail.js";

const testEmail = async () => {
  try {
    const subject = "Test Email from Auction Platform";
    const message = "This is a test email to verify the email sending functionality.";
    const email = process.env.TEST_EMAIL_RECIPIENT || "test@example.com";

    console.log(`Sending test email to: ${email}`);
    await sendEmail({ email, subject, message });
    console.log("Test email sent successfully!");
  } catch (error) {
    console.error("Failed to send test email:", error.message);
  }
};

testEmail();
