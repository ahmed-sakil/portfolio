import dotenv from 'dotenv';
dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || (nodeEnv === 'production' ? '' : 'dev_insecure_fallback_secret_32chars_min');

if (nodeEnv === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'fallback_secret' || process.env.JWT_SECRET.length < 16)) {
  console.error('\x1b[31m[CRITICAL SECURITY ERROR] JWT_SECRET must be explicitly set and at least 16 characters long in production mode! Aborting server boot.\x1b[0m');
  process.exit(1);
} else if (nodeEnv !== 'production' && !process.env.JWT_SECRET) {
  console.warn('\x1b[33m[SECURITY WARNING] Using temporary development JWT secret. Please set JWT_SECRET in your .env file.\x1b[0m');
}

const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const parsedClientUrls = rawClientUrl
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret,
  adminPath: process.env.ADMIN_PATH || 'login404',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  clientUrl: rawClientUrl,
  allowedOrigins: [
    ...parsedClientUrls,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ],
};

