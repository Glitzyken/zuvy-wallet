import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { FundWallet, RequestInterface } from '../../../utils/interfaces';
import convertToKobo from '../../../utils/convertToKobo';

const prisma = new PrismaClient();
const Wallet = prisma.wallet;

class WalletController {
  public async fundWallet(req: RequestInterface, res: Response) {
    const body: FundWallet = req.body;
    const wallet: any = await Wallet.findFirst({
      where: { userId: req.user.uid },
    });

    let balance;

    if (body.topUp) {
      const amount = convertToKobo(body.topUp);

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
