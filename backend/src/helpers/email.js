const nodemailer = require('nodemailer');

const config = require('../config/config');

const noreplyFromMail = '"Sender" <noreply@host>';
const transporter = nodemailer.createTransport(config.mailServer);

const sendPasswordReset = (email, returnUrl, token, lang) => {
  const resetLink = `${config.client.webAddress}${returnUrl}${token}/`;

  const mailOptions = {
    from: noreplyFromMail,
    to: email,
    subject: '',
    html: {
      data: {
        resetLink,
        daysValid: config.app.resetPasswordTokenValidDays,
      },
    },
  };

  return transporter.sendMail(mailOptions, (error) => {
    if (error) {
      throw error;
    }
  });
};

const sendActivationEmail = (email, returnUrl, token, lang) => {
  const activationLink = `${config.client.webAddress}${returnUrl}${token}/`;

  const mailOptions = {
    from: noreplyFromMail,
    to: email,
    subject: '',
    html: {
      data: {
        activationLink,
        daysValid: config.app.activationTokenValidDays,
        email,
      },
    },
  };

  return transporter.sendMail(mailOptions, (error) => {
    if (error) {
      throw error;
    }
  });
};

const sendNotificationEmail = (email, updatedTranslations, lang) => {
  const mailOptions = {
    from: noreplyFromMail,
    to: email,
    subject: '',
    html: {},
  };

  return transporter.sendMail(mailOptions, (error) => {
    if (error) {
      throw error;
    }
  });
};

module.exports = {
  sendPasswordReset,
  sendActivationEmail,
  sendNotificationEmail,
};
