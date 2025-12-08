const https = require('https');

console.log('Testing connection to accounts.google.com...');
const start = Date.now();

const req = https.get('https://accounts.google.com', (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  console.log(`✅ Time: ${Date.now() - start}ms`);
  res.resume();
});

req.on('error', (e) => {
  console.error(`❌ Error: ${e.message}`);
});

req.end();
