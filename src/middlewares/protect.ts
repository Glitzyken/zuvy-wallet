import { PrismaClient } from '@prisma/client';

import AppError from '../utils/appError';
import { NextFunction, Response } from 'express';
import { RequestInterface } from '../utils/interfaces';
import { verifyToken } from '../services/userService';

const prisma = new PrismaClient();

const UserModel = prisma.user;

export default async (
  req: RequestInterface,
  res: Response,
  next: NextFunction,
) => {
  const xApiKey = req.headers['x-api-key'];
  let token;
  let apiKey;
  if (typeof xApiKey === 'string') {
    if (xApiKey.startsWith('Zuvy')) {
      apiKey = xApiKey;
    }
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token && !apiKey) {
    return next(new AppError('No token or API key provided.', 403));
  }

  if (apiKey) {
    if (apiKey !== process.env.SECRET_KEY) {
      return next(new AppError('Invalid API key. Access denied.', 403));
    }

    console.log('Access granted!!! 🥳🥳🥳🥳');

    return next();
  }

  let verifiedToken;

  try {
    verifiedToken = await verifyToken(token, process.env.JWT_SECRET as string);
  } catch (err) {
    return next(
      new AppError('Token expired! Please log in again to get access.', 401),
    );
  }

  if (Date.now() >= verifiedToken.exp * 1000) {
    return next(new AppError('Token expired.', 401));
  }

  const currentUser = await UserModel.findFirst({
    where: { uid: verifiedToken.id },
  });

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401),
    );
  }

  req.user = currentUser;

  next();
};
