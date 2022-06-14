import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { createSendToken } from '../../../services/userService';
import walletIdGenerator from '../../../utils/walletIdGenerator';
import AppError from '../../../utils/appError';

const prisma = new PrismaClient();
const User = prisma.user;
const Wallet = prisma.wallet;

class UserController {
  public async signup(req: Request, res: Response) {
    const walletId = walletIdGenerator();

    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    };

    const user = await User.create({ data });

    // create a new wallet for the user
    if (user) {
      await Wallet.create({
        data: {
          userId: user.uid,
          walletId,
        },
      });
    }

    createSendToken(user, 201, req, res);
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const user = await User.findFirst({
      where: { email: req.body.email.toLowerCase() },
    });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      next(new AppError('Invalid Login details.', 400));
      return;
    }

    createSendToken(user, 201, req, res);
  }

  public async logout(req: Request, res: Response) {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
  }

  public async getOneUser(req: Request, res: Response) {
    const user = await User.findFirst({ where: { uid: req.params.uid } });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  }

  public async getAllUsers(req: Request, res: Response) {
    // Typically an Admin route
    const users = await User.findMany();

    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  }
}

export default UserController;
