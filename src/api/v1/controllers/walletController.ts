import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { FundWallet, RequestInterface } from '../../../utils/interfaces';
import convertToKobo from '../../../utils/convertToKobo';
import AppError from '../../../utils/appError';

const prisma = new PrismaClient();
const Wallet = prisma.wallet;
const Transaction = prisma.transaction;

class WalletController {
  public async fundMyWallet(req: RequestInterface, res: Response) {
    const { topUp }: FundWallet = req.body;

    const wallet = await Wallet.findFirst({
      where: { userId: req.user.uid },
    });

    let balance;

    if (wallet) {
      if (topUp) {
        const amountInKobo = convertToKobo(topUp);

        balance = wallet?.balance + amountInKobo;
      }
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

  public async transferFund(
    req: RequestInterface,
    res: Response,
    next: NextFunction,
  ) {
    const { amount, walletId }: FundWallet = req.body;

    const senderWallet = await Wallet.findFirst({
      where: { userId: req.user.uid },
    });
    const receiverWallet = await Wallet.findFirst({
      where: { walletId },
      include: { user: true },
    });

    // check if sender's wallet balance is sufficient
    if (senderWallet && receiverWallet) {
      if (typeof amount === 'number') {
        const amountInKobo: number = convertToKobo(amount);

        if (senderWallet.balance < amountInKobo) {
          return next(new AppError('Your balance is insufficient.', 400));
        }

        // debit sender's wallet and credit receiver's wallet
        const newSenderBalance = senderWallet?.balance - amountInKobo;
        const newReceiverBalance = receiverWallet?.balance + amountInKobo;

        const updatedSenderWallet = await Wallet.update({
          where: { uid: senderWallet.uid },
          data: { balance: newSenderBalance },
        });

        // if transaction fails, refund sender
        try {
          // throw new Error();

          await Wallet.update({
            where: { uid: receiverWallet.uid },
            data: { balance: newReceiverBalance },
          });
        } catch (error) {
          if (error) {
            const balanceAfterRefund =
              updatedSenderWallet.balance + amountInKobo;

            await Wallet.update({
              where: { uid: senderWallet.uid },
              data: { balance: balanceAfterRefund },
            });

            return next(
              new Error('Something went very wrong. Money refunded.'),
            );
          }
        }

        // create a new transaction record
        const receiverDetails = {
          name: `${receiverWallet.user?.firstName} ${receiverWallet.user?.lastName}`,
          email: receiverWallet.user?.email,
        };

        await Transaction.create({
          data: {
            amount: amountInKobo,
            userId: req.user.uid,
            receiverDetails,
          },
        });

        // respond with the sender's current wallet (+balance)
        res.status(200).json({
          status: 'success',
          data: {
            updatedSenderWallet,
          },
        });
      }
    } else {
      return next(
        new AppError(
          'No wallet found. Please, check that the walled ID is valid.',
          404,
        ),
      );
    }
  }

  public async findWalletUser(req: Request, res: Response, next: NextFunction) {
    const { walletId }: FundWallet = req.query;

    if (!walletId) {
      return next(new AppError('Please, provide a wallet ID.', 400));
    }

    const wallet = await Wallet.findFirst({
      where: { walletId },
      include: { user: true },
    });

    if (wallet) {
      let walletUser;

      if (wallet.user) {
        walletUser = {
          firstName: wallet.user.firstName,
          lastName: wallet.user.lastName,
        };
      }

      res.status(200).json({
        status: 'success',
        data: {
          walletUser,
        },
      });
    } else {
      return next(new AppError('No wallet user found.', 404));
    }
  }

  public async getMyWallet(req: RequestInterface, res: Response) {
    const wallet = await Wallet.findFirst({ where: { userId: req.user.uid } });

    res.status(200).json({
      status: 'success',
      data: {
        wallet,
      },
    });
  }

  public async getAllWallets(req: Request, res: Response) {
    // Typically an Admin route
    const wallets = await Wallet.findMany();

    res.status(200).json({
      status: 'success',
      results: wallets.length,
      data: {
        wallets,
      },
    });
  }
}

export default WalletController;
