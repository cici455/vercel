const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DEMO_FILE = path.join(__dirname, 'tarot-demo.html');

const server = http.createServer((req, res) => {
  // Set CORS headers to allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Serve the tarot demo file for all requests to keep it simple
  fs.readFile(DEMO_FILE, (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end(`Error loading tarot-demo.html: ${err.message}`);
      return;
    }
    
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n====================================`);
  console.log(`LUMINA Tarot Selector Demo Server`);
  console.log(`====================================`);
  console.log(`\n✅ Server is running successfully!`);
  console.log(`\n📌 Access the demo at:`);
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   or`);
  console.log(`   http://127.0.0.1:${PORT}/`);
  console.log(`\n📝 The server will serve the tarot-demo.html file for all requests.`);
  console.log(`\n🔧 Press Ctrl+C to stop the server.`);
  console.log(`====================================\n`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('\n❌ Server Error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use. Try a different port.`);
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n📤 Server is shutting down...');
  server.close(() => {
    console.log('✅ Server has been stopped.');
    process.exit(0);
  });
});