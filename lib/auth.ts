import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'user';
  is_active: boolean;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Hash a password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Authenticate user with email and password
 */
export const authenticateUser = async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
  try {
    const result = await query(
      'SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return null;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active,
      },
      token,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    const result = await query(
      'SELECT id, email, full_name, role, is_active FROM users WHERE id = $1 AND is_active = true',
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

/**
 * Create a new user
 */
export const createUser = async (email: string, password: string, fullName: string, role: 'admin' | 'manager' | 'user' = 'user'): Promise<User | null> => {
  try {
    const passwordHash = await hashPassword(password);

    const result = await query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role, is_active',
      [email, passwordHash, fullName, role]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Create user error:', error);
    return null;
  }
};
