import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function sendResetEmail(to: string, code: string) {
  await transporter.sendMail({
    from: EMAIL_USER,
    to,
    subject: "Password Reset Code",
    text: `your reset code is: ${code}\nthis code expires in 10 minutes`,
  });
}