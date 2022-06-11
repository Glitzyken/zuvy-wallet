import express from 'express';

import WalletController from '../controllers/walletController';

const router = express.Router();

const controller = new WalletController;

router.route('/').post(controller.createWallet);

export default router;