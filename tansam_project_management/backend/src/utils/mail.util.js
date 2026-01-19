import dotenv from "dotenv";
dotenv.config(); // ✅ ADD THIS AT THE VERY TOP

import nodemailer from "nodemailer";

console.log("MAIL_HOST =", process.env.MAIL_HOST);
console.log("MAIL_PORT =", process.env.MAIL_PORT);
console.log("MAIL_USER =", process.env.MAIL_USER);
console.log("MAIL_FROM =", process.env.MAIL_FROM);

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false, // true only for 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  if (!to) return;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
};
