import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { RequestInterface } from '../../../utils/interfaces';

const prisma = new PrismaClient();
const Transaction = prisma.transaction;
const PostTransaction = prisma.postTransaction;

class TransactionController {
  public async getMyTransactions(req: RequestInterface, res: Response) {
    const userTransactions = await Transaction.findMany({
      where: { userId: req.user.uid },
    });

    res.status(200).json({
      status: 'success',
      data: {
        userTransactions,
      },
    });
  }

  public async getAllPostTransactions(req: RequestInterface, res: Response) {
    const postTransactions = await PostTransaction.findMany();

    res.status(200).json({
      status: 'success',
      data: {
        postTransactions,
      },
    });
  }
}

export default TransactionController;
