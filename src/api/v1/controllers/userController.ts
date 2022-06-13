import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { createSendToken } from '../../../services/userService';
import walletIdGenerator from '../../../utils/walletIdGenerator';

const prisma = new PrismaClient();
const User = prisma.user;

class UserController {
  public async signup(req: Request, res: Response) {
    const walletId = walletIdGenerator();

    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      wallet: {
        create: {
          walletId,
        },
      },
    };

    const user = await User.create({ data });

    createSendToken(user, 201, req, res);
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
