import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const Wallet = prisma.wallet;

class WalletController {
  public async fundWallet(req: Request, res: Response) {
    const wallets = await Wallet.findMany();

    res.status(200).json({
      status: 'success',
      data: {
        wallets,
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
