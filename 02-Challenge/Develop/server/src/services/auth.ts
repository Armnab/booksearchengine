import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use environment variable or fallback secret
const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret';

// Define the JWT Payload Interface
interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

// Generate JWT Token (Fixed)
export const signToken = (user: JwtPayload) => {
  return jwt.sign(
    { _id: user._id, username: user.username, email: user.email },
    SECRET_KEY,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

// Authenticate Token for GraphQL Context (Fixed)
export const getUserFromToken = (token?: string) => {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (err) {
    console.error('Invalid Token:', err.message);
    return null;
  }
};

// Middleware Function (Optional Fix)
export const authenticateToken = (token: string): JwtPayload | null => {
  return getUserFromToken(token);
};