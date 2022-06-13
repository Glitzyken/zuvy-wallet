import express from 'express';

import TransactionController from '../controllers/transactionController';
import protect from '../../../middlewares/protect';
import catchAsync from '../../../utils/catchAsync';

const router = express.Router();

const controller = new TransactionController();

router.use(catchAsync(protect));

router.route('/my-transactions').get(catchAsync(controller.getMyTransactions));
router
  .route('/post-transactions')
  .get(catchAsync(controller.getAllPostTransactions));

export default router;
