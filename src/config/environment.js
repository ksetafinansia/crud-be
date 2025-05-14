const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const requiredEnvVars = ['NODE_ENV', 'PORT', 'MONGODB_URI', 'API_KEY'];

// Validate required environment variables
requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    console.error(`Error: Environment variable ${env} is required`);
    process.exit(1);
  }
});

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  apiKey: process.env.API_KEY
};