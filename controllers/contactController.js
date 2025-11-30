const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 1️⃣ Save to MongoDB
    const contact = await Contact.create({ name, email, message });

    // 2️⃣ Setup NodeMailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your provider
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    // 3️⃣ Email content
    const mailOptions = {
      from: email, // sender (user)
      to: process.env.EMAIL_USER, // receiver (your email)
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // 4️⃣ Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email error:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // 5️⃣ Respond to frontend
    res.status(201).json({
      success: true,
      message: "Message received and email sent!",
      contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
