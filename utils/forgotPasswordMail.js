// comment out for to do later
/*
const nodeMailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: "../config/config.env" });

const sendEmail = async(options) => {
    const transporter = nodeMailer.createTransport({
        port: 465,
        secure:true,
        logger:true,
        debug:true,
        secureConnecton:false,
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_EMAIL,
            pass:process.env.SMTP_PASSWORD
        },
        tls:{
            rejectUnauthorized:false
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
*/