import { sendEmail } from "../utils/sendEmail.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const sendContactMessage = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  // Prepare email content
  const emailSubject = `Contact Form: ${subject}`;
  const emailMessage = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;

  // Send email to admin/support
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_MAIL;

  try {
    await sendEmail({
      email: adminEmail,
      subject: emailSubject,
      message: `New contact form submission from ${name}`,
      html: emailMessage,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("SMTP_HOST:", process.env.SMTP_HOST ? "Set" : "Not set");
    console.error("SMTP_PORT:", process.env.SMTP_PORT ? "Set" : "Not set");
    console.error("SMTP_SERVICE:", process.env.SMTP_SERVICE ? "Set" : "Not set");
    console.error("SMTP_MAIL:", process.env.SMTP_MAIL ? "Set" : "Not set");
    console.error("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "Set" : "Not set");
    console.error("ADMIN_EMAIL:", process.env.ADMIN_EMAIL ? "Set" : "Not set");
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
});
