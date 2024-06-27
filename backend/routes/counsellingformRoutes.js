const express = require('express');
const router = express.Router();
//const ClientConnect = require('../dbConnect/clientConnect')
const { connectToMongoDB ,client} = require('../dbConnect/clientConnect');
const CounsellingForm = require('../models/counsellingform');


router.post('/counsellingform', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const { studentName, grade, schoolName, parentName, parentOccupation, mobileNumber, zipcode, city, session, date } = req.body;
    const newForm = new CounsellingForm(studentName, grade, schoolName, parentName, parentOccupation, mobileNumber, zipcode, city, session, date);

    const collection = db.collection('counsellingforms'); // Replace with your collection name
    const result = await collection.insertOne(newForm);
    console.error('Form submitted successfully:', result);
    client.close();
  } catch (err) {
    console.error('Error submitting form:', err);
    res.status(500).send('Failed to submit form');
  }
});

module.exports = router;
