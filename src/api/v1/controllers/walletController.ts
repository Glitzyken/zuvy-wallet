import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { FundWallet, RequestInterface } from '../../../utils/interfaces';
import convertToKobo from '../../../utils/convertToKobo';
import AppError from '../../../utils/appError';

const prisma = new PrismaClient();
const Wallet = prisma.wallet;

class WalletController {
  public async fundWallet(req: RequestInterface, res: Response) {
    const { topUp }: FundWallet = req.body;
    
    const wallet: any = await Wallet.findFirst({
      where: { userId: req.user.uid },
    });

    let balance;

    if (topUp) {
      const amount = convertToKobo(topUp);

      balance = wallet?.balance + amount;
    }

    const walletFunded = await Wallet.update({
      where: { uid: wallet?.uid },
      data: { balance },
    });

    res.status(200).json({
      status: 'success',
      data: {
        walletFunded,
      },
    });
  }

  public async findWalletUser(req: Request, res: Response, next: NextFunction) {
    const { walletId }: FundWallet = req.params;

    const wallet: any = await Wallet.findFirst({
      where: { walletId },
      include: { user: true },
    });

    if (!wallet) {
      return next(new AppError('No wallet user found.', 404));
    }

    const walletUser = {
      firstName: wallet.user.firstName,
      lastName: wallet.user.lastName,
    };

    res.status(200).json({
      status: 'success',
      data: {
        walletUser,
      },
    });
  }

  public async getAllWallets(req: Request, res: Response) {
    // Typically an Admin route
    const wallets = await Wallet.findMany();

    res.status(200).json({
      status: 'success',
      data: {
        wallets,
      },
    });
  }
}

export default WalletController;
