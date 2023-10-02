import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const mailer = nodemailer.createTransport({
    host: 'smtppro.zoho.in',
    port: 465,
    secure: true, //ssl
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export default mailer