#!/usr/bin/env node
require('dotenv').config();

// var nodeMailer = require("nodemailer");
// var EmailTemplate = require('email-templates');

// var transporter = nodeMailer.createTransport({
//     host: 'smtp@gmail.com',
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS
//     }
// });

// // var sendReport = transporter.templateSender(
// //     new EmailTemplate('./templates/sendReportTemplate', {
// //         from: 'skalra912@gmail.com',
// //     })
// // );

// const email = new EmailTemplate({
//     transport: transporter,
//     send: true,
//     preview: false,
//     views: {
//         options: {
//             extension: 'ejs',
//         }
//     }
// });

// module.exports= {
//     email: email
// };

// require('dotenv-safe').config();

const nodemailer = require('nodemailer');
const Email = require('email-templates');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: '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'
  })
);

// console.log(transporter, "TRANSPORTER");
const email = new Email({
    message: {
        from: 'skalra912@gmail.com'
    },
    send: true,
    transport
});
// console.log(email, "EMAIL");
// email.send({
//   template: 'hello',
//   message: {
//     to: 'skalra912@gmail.com',
//   },
//   locals: {
//     fname: 'John',
//     lname: 'Snow',
//   }
// }).then(() => console.log('email has been sent!'))
// .catch((error) => console.log(error));