import express from 'express';

import WalletController from '../controllers/walletController';
import protect from '../../../middlewares/protect';
import catchAsync from '../../../utils/catchAsync';
import { topUp } from './../../../middlewares/validations/walletValidation';
import validationResults from '../../../middlewares/validations/validationResults';

const router = express.Router();

const controller = new WalletController();

router.use(catchAsync(protect));
router
  .route('/fund')
  .patch(topUp, validationResults, catchAsync(controller.fundWallet));

// Typical Admin routes
router.route('/').get(catchAsync(controller.getAllWallets));

export default router;
