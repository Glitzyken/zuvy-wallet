import express from 'express';
import walletRoutes from './walletRoutes';
import userRoutes from './userRoutes';
import transactionRoutes from './transactionRoutes';

const router = express.Router();

router.use('/wallets', walletRoutes);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);

export default router;
