import express from 'express';

import WalletController from '../controllers/walletController';

const router = express.Router();

const controller = new WalletController();

// Typical Admin routes
router.route('/').get(controller.getAllWallets);

export default router;
