import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import createSendToken from '../../../utils/createSendToken';
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
}

export default UserController;
