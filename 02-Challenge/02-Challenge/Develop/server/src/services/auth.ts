import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret';

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

// Generate JWT Token
export const signToken = (user: JwtPayload) => {
  return jwt.sign({ _id: user._id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};

// Authenticate Token for GraphQL Context
export const getUserFromToken = (token?: string) => {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (err) {
    console.error('Invalid Token:', err);
    return null;
  }
};