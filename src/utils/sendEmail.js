import nodemailer from "nodemailer";
import { confirmationTemp } from "./html.mailTemp.js";
import { host } from "../modules/auth/auth.controller.js";

const transporter = nodemailer.createTransport({
  host: host,
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, temp, attachments }) => {
  const info = await transporter
    .sendMail({
      from: `'"E-Commerce Application 🛒 " <${process.env.EMAIL}>'`, // sender address
      to,
      subject,
      html: temp,
      attachments,
    })
    .catch((err) => console.log(err));
  if (info.accepted.length >= 0) return true;
  return false;
};
