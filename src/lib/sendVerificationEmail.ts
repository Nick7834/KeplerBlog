import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.SMTP_USER,  
        pass: process.env.SMTP_PASS,  
    },
    tls: {
        rejectUnauthorized: false,
    },
});

async function sendVerificationEmail(email: string, code: string) {
    const mailOptions = {
        from: `KeplerBlog <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify your email',
        text: `Your verification code is: ${code}`,
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export default sendVerificationEmail;