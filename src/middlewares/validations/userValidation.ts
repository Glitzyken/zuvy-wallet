import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import AppError from '../../utils/appError';
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

const User = prisma.user;

export const mainFields = [
  body('firstName').exists().withMessage('First name is required.').trim(),
  body('lastName').exists().withMessage('Last name is required.').trim(),
  body('email')
    .exists()
    .withMessage('Email address is required.')
    .isEmail()
    .withMessage('Please, provide a valid email.'),
];

export const loginCheck = [
  body('email')
    .exists()
    .withMessage('email addess is required')
    .isEmail()
    .withMessage('Please, provide a valid email.'),
  body('password').exists().withMessage('Password is required.'),
];

export const passwordFields = [
  body('passwordConfirm')
    .exists()
    .withMessage('Password confirmation is required.'),
  body('password')
    .exists()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
];

export const ifAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userExists = await User.findFirst({
    where: { email: req.body.email.toLowerCase() },
  });

  if (userExists) {
    next(new AppError('E-mail already in use.', 400));
    return;
  }

  next();
};

export const passwordMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.passwordConfirm !== req.body.password) {
    next(new AppError('Password confirm does not match password.', 400));
    return;
  }

  // Hash password with a cost of 12
  req.body.password = await bcrypt.hash(req.body.password, 12);

  // do not persist passwordConfirm
  req.body.passwordConfirm = null;

  next();
};
