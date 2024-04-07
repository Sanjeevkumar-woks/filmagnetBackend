import nodemailer from "nodemailer";

interface SendEmailProps {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = (payload: SendEmailProps) => {
  try {
    transporter.sendMail(payload, (error: any, info: any) => {
      if (error) {
        throw new Error(`
          NodeMailer: Error sending email: ${error}
         `);
      } else {
        console.log(`NodeMailer: Email sent: ${info.response}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
