  import nodemailer from "nodemailer"
  import 'dotenv/config';
  const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });


    export async function emailSender(address, subject, message){
         try {
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: address,
            subject: subject, // subject line
            text: message, // plain text body
            // html: "<b>Hello world?</b>", // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (err) {
        console.error("Error while sending mail:", err);
    }
    }