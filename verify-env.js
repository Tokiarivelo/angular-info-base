const fs = require('fs');
const path = require('path');

try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });

  const required = [
    'AUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_URL',
  ];
  const missing = [];
  const empty = [];

  required.forEach((key) => {
    if (!envVars.hasOwnProperty(key)) {
      missing.push(key);
    } else if (!envVars[key]) {
      empty.push(key);
    } else {
      console.log(`✅ ${key} is present`);
    }
  });

  if (missing.length > 0) {
    console.log('❌ Missing variables:', missing.join(', '));
  }
  if (empty.length > 0) {
    console.log('⚠️ Empty variables:', empty.join(', '));
  }
} catch (error) {
  console.error('Error reading .env:', error);
}
