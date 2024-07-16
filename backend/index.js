require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const counsellingFormRoutes = require('./routes/counsellingformRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const twilio = require('twilio');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { sendContactFormEmail } = require('./utils/email');


const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware with options
const corsOptions = {
  origin: '*',  // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed HTTP headers
};

app.use(cors(corsOptions));

console.log('MONGODB_URI:', process.env.MONGODB_URI);  // Added this line for debugging


// Twilio credentials
const accountSid = 'ACed903e57b6c388f500c5e34f6eff2012';
const authToken = '94ee67cbb06b337ff305539de7f09a82';
const serviceSid = 'VAcfd1abaa669c80481f5d2196ab9ee0ab'; // Replace with your Verify Service SID

const client = twilio(accountSid, authToken);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to handle contact form submissions
app.post('/contactForm', async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    await sendContactFormEmail(name, email, phone, subject, message);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
});


// Endpoint to send OTP
app.post('/sendOTP', async (req, res) => {
  const { mobileNumber } = req.body; // Expecting mobileNumber to be in E.164 format

  try {
    const verification = await client.verify.v2.services(serviceSid)
      .verifications
      .create({ to: mobileNumber, channel: 'sms' });

    console.log('Verification:', verification);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});
// Endpoint to verify OTP
app.post('/verifyOTP', async (req, res) => {
  const { otp, mobileNumber } = req.body;

  try {
    const verificationCheck = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: mobileNumber, code: otp });

    if (verificationCheck.status === 'approved') {
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      throw new Error('Invalid OTP');
    }
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', counsellingFormRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }).then(() => {
//     console.log('Connected to MongoDB');
//   }).catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });
  
//   // Check mongoose connection status
//   const db = mongoose.connection;
//   db.on('error', (err) => console.error('MongoDB connection error:', err));
//   db.once('open', () => console.log('MongoDB connected successfully'));
