import express from 'express';

import WalletController from '../controllers/walletController';
import protect from '../../../middlewares/protect';
import catchAsync from '../../../utils/catchAsync';
import {
  topUp,
  transfer,
} from './../../../middlewares/validations/walletValidation';
import validationResults from '../../../middlewares/validations/validationResults';

const router = express.Router();

const controller = new WalletController();

router.use(catchAsync(protect));
router
  .route('/fund-my-wallet')
  .patch(topUp, validationResults, catchAsync(controller.fundMyWallet));
router.route('/find-user/:walletId').get(catchAsync(controller.findWalletUser));
router
  .route('/transfer-fund')
  .post(transfer, validationResults, catchAsync(controller.transferFund));

router.route('/my-transactions').get(catchAsync(controller.getMyTransactions));

// Typical Admin routes
router.route('/').get(catchAsync(controller.getAllWallets));

export default router;
