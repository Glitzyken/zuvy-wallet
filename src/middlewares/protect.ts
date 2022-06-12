import { PrismaClient } from '@prisma/client';

import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';
import { NextFunction, Response } from 'express';
import { RequestInterface } from '../utils/interfaces';

const prisma = new PrismaClient();

const UserModel = prisma.user;

export default async (
  req: RequestInterface,
  res: Response,
  next: NextFunction,
) => {
  // Get token and check of it's there
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
    next(new AppError('You are not logged in! Please log in.', 401));
    return;
  }

  // Verification token
  if (token) {
    let decoded: any;

    try {
      decoded = await promisify(jwt.verify)(token);
    } catch (err: any) {
      next(new AppError(err.message, 401));
      return;
    }

    // RETURN IF TOKEN HAS EXPRIRED
    if (Date.now() >= decoded.exp * 1000) {
      next(new AppError('Token expired.', 401));
      return;
    }

    // Check if user still exists
    const currentUser = await UserModel.findFirst({
      where: { uid: decoded.id },
    });

    if (!currentUser) {
      next(
        new AppError('The user belonging to this token no longer exists.', 401),
      );
      return;
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
  }

  next();
};
