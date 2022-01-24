const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRIT_API_KEY } = process.env;

sgMail.setApiKey(SENDGRIT_API_KEY);

const sendEmail = async (data) => {
  try {
    const email = { ...data, from: "sova.volodymyr95@gmail.com" };
    await sgMail.send(email);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
