const nodemailer = require("nodemailer");
const sendEmail = async (subject, message, send_to, send_from, reply_to) => {
  // Create Email Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // Options for sending email

  const options = {
    from: send_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,
  };

  //  Send Email
  await new Promise((resolve, reject) => {
    transporter.sendMail(options, function (err, info) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
};

module.exports = sendEmail;

// const { SuperfaceClient } = require("@superfaceai/one-sdk");

// // You can manage tokens here: https://superface.ai/insights
// const sdk = new SuperfaceClient({
//   sdkAuthToken:
//     "sfs_a7f1e95fc13ec812706c739e45410aa70bffd1cb79512df77f0e77407244fc00c1786422e8a7fabb6c51546c88f150f242e0b095b750290f2f6202aef7752502_cce76e54",
// });

// const sendEmail = (subject, message, send_to, send_from, reply_to) => {
//   async function run() {
//     // Load the profile
//     const profile = await sdk.getProfile("communication/send-email@2.2.0");

//     // Use the profile
//     const result = await profile.getUseCase("SendEmail").perform(
//       {
//         from: send_from,
//         to: send_to,
//         subject: subject,
//         html: message,
//         replyTo: reply_to,
//       },
//       {
//         provider: "mock",
//       }
//     );

//     // Handle the result
//     try {
//       const data = result.unwrap();
//       console.log(data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   run();
// };

// module.exports = sendEmail;
