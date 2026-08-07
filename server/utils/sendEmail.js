import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// send email utility function
const sendEmail = async (to, subject, html) => {
    try {
        const { error } = await resend.emails.send({
            from: "CRUD App <onboarding@resend.dev>",
            to,
            subject,
            html
        });

        if (error) {
            console.error(`❌ Email error:`, error);
            return;
        }

        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error(`❌ Email error: ${error.message}`);
    }
};

export default sendEmail;








//USING NODEMAILER/SMTP
/*import nodemailer from "nodemailer";

// create transporter — connection to Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// send email utility function
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"CRUD App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error(`❌ Email error: ${error.message}`);
    }
};

export default sendEmail;*/