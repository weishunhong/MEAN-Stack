import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'catsmeow';

export interface DecodedToken {
  _id: string;
  username: string;
  email: string;
  lastLogin: string;
}

export function generateToken(user: any): string {
  return jwt.sign(user, JWT_SECRET);
}

export function decodeToken(token: string): DecodedToken {
  return jwt.verify(token, JWT_SECRET) as DecodedToken;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function authorized(req: any): DecodedToken | null {
  try {
    const token = req.headers.authorization;
    if (!token) return null;
    return decodeToken(token);
  } catch (error) {
    return null;
  }
}
