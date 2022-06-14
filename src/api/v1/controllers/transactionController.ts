import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import _ from 'lodash';

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
      message: 'Set peak_hours.',
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

  public async getSpeciallyFilteredTransactions(
    req: RequestInterface,
    res: Response,
  ) {
    // all transactions greater than #1,500 and carried out only between the hours of 7:00 AM and 3:00 PM
    const transactions = await Transaction.findMany({
      where: { amount: { gt: 150000 } },
    });

    const filteredTransactions = _.filter(transactions, function (tran) {
      const tranHour = tran.date.getHours();

      if (tranHour >= 7 && tranHour <= 15) {
        return tran;
      }
    });

    res.status(200).json({
      status: 'success',
      results: filteredTransactions.length,
      data: {
        filteredTransactions,
      },
    });
  }

  public async getAllTransactions(req: RequestInterface, res: Response) {
    const transactions = await Transaction.findMany();

    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: {
        transactions,
      },
    });
  }
}

export default TransactionController;
