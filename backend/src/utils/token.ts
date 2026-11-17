import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../config/env.js';
import { AdminPayload } from '../types/index.js';

export const signToken = (payload: AdminPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): AdminPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
};

export const setAdminCookie = (res: Response, token: string): void => {
  res.cookie(env.ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.IS_PROD,
    sameSite: env.IS_PROD ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export const clearAdminCookie = (res: Response): void => {
  res.clearCookie(env.ADMIN_COOKIE_NAME, {
    httpOnly: true,
    secure: env.IS_PROD,
    sameSite: env.IS_PROD ? 'none' : 'lax',
    path: '/',
  });
};
