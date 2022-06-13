import { PrismaClient } from '@prisma/client';

import { promisify } from 'util';
import jwt from 'jsonwebtoken';
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
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('No token provided.', 403));
  }

  let verifiedToken;

  try {
    verifiedToken = await verifyToken(token, process.env.JWT_SECRET as string);
  } catch (err) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  if (Date.now() >= verifiedToken.exp * 1000) {
    next(new AppError('Token expired.', 401));
    return;
  }

  const currentUser = await UserModel.findFirst({
    where: { uid: verifiedToken.id },
  });

  if (!currentUser) {
    next(
      new AppError('The user belonging to this token no longer exists.', 401),
    );
    return;
  }

  req.user = currentUser;

  next();
};
