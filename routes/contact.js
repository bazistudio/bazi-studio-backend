const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.post("/", contactController.createContact);

module.exports = router;



const Contact = require("../models/Contact"); // your MongoDB model
const nodemailer = require("nodemailer");

exports.createContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // 1️⃣ Save message to MongoDB
    const newMessage = await Contact.create({ name, email, subject, message });

    // 2️⃣ Setup NodeMailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use App Password if Gmail
      },
    });

    // 3️⃣ Email content
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // your email to receive messages
      subject: `New Contact Message: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // 4️⃣ Send email
    await transporter.sendMail(mailOptions);

    // 5️⃣ Send response to frontend
    res.status(200).json({ msg: "Message received and email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
};
