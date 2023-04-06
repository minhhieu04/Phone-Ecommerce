const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
const sendMail = asyncHandler(async({ email, html, subject }) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.GOOGLE_EMAIL_NAME, // generated ethereal user
          pass: process.env.GOOGLE_APP_PASSWORD, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Minh Hieu" <Hiu.mobile@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: "Hello world?", // plain text body
        html: html, // html body
      });
      return info;
});

module.exports = sendMail;