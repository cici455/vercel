const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db('messages');
  }
  return db;
}

module.exports = async (req, res) => {
  try {
    const database = await connectToDatabase();
    const messagesCollection = database.collection('messages');

    if (req.method === 'POST') {
      const message = req.body;
      message.createdAt = new Date();
      await messagesCollection.insertOne(message);
      res.status(201).json({ message: 'Message sent successfully' });
    } else if (req.method === 'GET') {
      const messages = await messagesCollection.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();
      res.status(200).json(messages);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
