require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient( process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let db;
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(process.env.DATABASENAME);
    return db
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

module.exports = { connectToMongoDB, client };
