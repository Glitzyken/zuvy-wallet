import express from 'express';
import walletRoutes from './walletRoutes';
import userRoutes from './userRoutes';

const router = express.Router();

router.use('/wallets', walletRoutes);
router.use('/users', userRoutes);

export default router;
