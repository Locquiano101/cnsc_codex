import nodemailer from "nodemailer"; // ES Module
import dotenv from "dotenv";

dotenv.config();

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const NodeEmail = async (emailAddress, emailSubject, emailMessage) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailAddress,
      subject: emailSubject,
      text: emailMessage + "\n\n this is email is auto-generated. DO NOT REPLY",
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};
