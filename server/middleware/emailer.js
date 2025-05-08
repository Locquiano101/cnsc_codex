import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Fix: Add tls.rejectUnauthorized = false for development with self-signed certs
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // <-- this is important for bypassing cert check
  },
});

export const NodeEmail = async (emailAddress, emailSubject, emailMessage) => {
  if (!emailAddress) {
    console.error("NodeEmail: No recipient email address provided.");
    return { success: false, error: "Missing recipient" };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailAddress,
      subject: emailSubject,
      text: emailMessage + "\n\nThis is an auto-generated email. DO NOT REPLY.",
    });
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
};
