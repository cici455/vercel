const { MongoClient } = require('mongodb');

let client;
let db;

// Get URI from environment variables at runtime, not at module load time
const getMongoURI = () => {
  console.log('Getting MongoDB URI from environment variables...');
  const uri = process.env.MONGODB_URI;
  console.log('MongoDB URI from env:', uri);
  return uri;
};

async function connectToDatabase() {
  console.log('Attempting to connect to MongoDB...');
  const uri = getMongoURI();
  console.log('MongoDB URI:', uri);
  
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  
  if (!client) {
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoClient created, connecting...');
      await client.connect();
      console.log('Connected to MongoDB!');
      db = client.db('messages');
      console.log('Database selected:', db.databaseName);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      throw error;
    }
  }
  return db;
}

module.exports = async (req, res) => {
  try {
    console.log('Processing request:', req.method, req.url);
    
    const database = await connectToDatabase();
    const messagesCollection = database.collection('messages');

    if (req.method === 'POST') {
      const message = req.body;
      message.createdAt = new Date();
      await messagesCollection.insertOne(message);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Message sent successfully' }));
    } else if (req.method === 'GET') {
      const messages = await messagesCollection.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(messages));
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Method not allowed' }));
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Internal server error',
      error: error.message 
    }));
  }
};
