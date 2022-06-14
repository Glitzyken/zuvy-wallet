import express from 'express';

import TransactionController from '../controllers/transactionController';
import protect from '../../../middlewares/protect';
import catchAsync from '../../../utils/catchAsync';

const router = express.Router();

const controller = new TransactionController();

router.use(catchAsync(protect));

router
  .route('/post-transactions')
  .get(catchAsync(controller.getAllPostTransactions))
  .post(catchAsync(controller.bulkCreatePostTransactions));

router
  .route('/post-transactions/peak-hours')
  .patch(catchAsync(controller.flagPostTransactions));

router.route('/my-transactions').get(catchAsync(controller.getMyTransactions));

router
  .route('/special-filters')
  .get(catchAsync(controller.getSpeciallyFilteredTransactions));
router.route('/').get(catchAsync(controller.getAllTransactions));

export default router;
