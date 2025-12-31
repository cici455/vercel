const http = require('http');
const fs = require('fs');
const path = require('path');
const messageApi = require('./api/message');
const dotenv = require('dotenv');

// Load environment variables from .env file
console.log('Attempting to load .env file...');
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Loaded .env file successfully');
  console.log('Environment variables loaded:', Object.keys(result.parsed || {}));
  console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? 'Yes' : 'No');
}

// Also print for api/message.js usage
process.env.MONGODB_URI = process.env.MONGODB_URI || '';
console.log('process.env.MONGODB_URI:', process.env.MONGODB_URI);

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle API requests
  if (req.url === '/api/message') {
    // Mock req.body for POST requests
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        req.body = JSON.parse(body);
        await messageApi(req, res);
      });
    } else {
      await messageApi(req, res);
    }
    return;
  }

  // Serve static files from public directory
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, 'public', filePath);

  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`API endpoint: http://localhost:${PORT}/api/message`);
});
