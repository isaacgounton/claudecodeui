import jwt from 'jsonwebtoken';
import { userDb } from '../database/db.js';

// Get JWT secret from environment or use default (for development)
const JWT_SECRET = process.env.JWT_SECRET || 'claude-ui-dev-secret-change-in-production';

// Optional API key middleware
const validateApiKey = (req, res, next) => {
  // Skip API key validation if not configured
  if (!process.env.API_KEY) {
    return next();
  }
  
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

// JWT authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token || !token.trim()) {
    console.log('❌ No token provided. Auth header:', authHeader);
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const trimmedToken = token.trim();

  // Basic JWT format validation (should have 3 parts separated by dots)
  if (trimmedToken.split('.').length !== 3) {
    console.log('❌ Malformed JWT token format. Parts:', trimmedToken.split('.').length);
    return res.status(401).json({ error: 'Invalid token format.' });
  }

  // Debug: Log token info (first and last 10 chars for security)
  console.log('🔑 Token received:', trimmedToken.substring(0, 10) + '...' + trimmedToken.substring(trimmedToken.length - 10));

  try {
    const decoded = jwt.verify(trimmedToken, JWT_SECRET);
    
    // Verify user still exists and is active
    const user = userDb.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    console.error('Token that failed:', trimmedToken.substring(0, 20) + '...');
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Generate JWT token (never expires)
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username 
    },
    JWT_SECRET
    // No expiration - token lasts forever
  );
};

// WebSocket authentication function
const authenticateWebSocket = (token) => {
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('WebSocket token verification error:', error);
    return null;
  }
};

export {
  validateApiKey,
  authenticateToken,
  generateToken,
  authenticateWebSocket,
  JWT_SECRET
};