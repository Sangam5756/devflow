const nodemailer = require("nodemailer");
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_PASSWORD,
  SMTP_MAIL,
  SMTP_SERVICE,
} = require("../config/server.config");

const sendEmail = async (options) => {
  console.log(options);
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      service: SMTP_SERVICE,
      secure: true,
      auth: {
        user: SMTP_MAIL,
        pass: SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    // Send the email and return the result
    const mail = await transporter.sendMail(mailOptions);

    return mail;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
