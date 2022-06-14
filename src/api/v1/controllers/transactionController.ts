import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { RequestInterface } from '../../../utils/interfaces';

const prisma = new PrismaClient();
const Transaction = prisma.transaction;
const PostTransaction = prisma.postTransaction;

class TransactionController {
  public async bulkCreatePostTransactions(
    req: RequestInterface,
    res: Response,
  ) {
    const { transactions } = req.body;

    const result = await PostTransaction.createMany({
      data: [...transactions],
      skipDuplicates: true,
    });

    res.status(200).json({
      status: 'success',
      result,
    });
  }

  public async flagPostTransactions(req: RequestInterface, res: Response) {
    await PostTransaction.updateMany({
      data: {
        peakHours: true,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Set peak_hours to true.',
    });
  }

  public async getAllPostTransactions(req: RequestInterface, res: Response) {
    const postTransactions = await PostTransaction.findMany();

    res.status(200).json({
      status: 'success',
      results: postTransactions.length,
      data: {
        postTransactions,
      },
    });
  }

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

  public async getAllTransactions(req: RequestInterface, res: Response) {
    const transactions = await Transaction.findMany();

    res.status(200).json({
      status: 'success',
      data: {
        transactions,
      },
    });
  }
}

export default TransactionController;
