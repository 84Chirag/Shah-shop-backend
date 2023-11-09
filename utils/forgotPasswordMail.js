const nodeMailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: "../config/config.env" });

const sendEmail = async(options) => {
    const transporter = nodeMailer.createTransport({
        service:process.env.SMTP_SERVICE,
        host:"smtp.gmail.com",
        port: 465,
        secure:true,
        // logger:true,
        // debug:true,
        auth:{
            user:process.env.SMTP_EMAIL,
            pass:process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from:process.env.SMTP_EMAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    transporter.sendMail(mailOptions);
}

module.exports = sendEmail;