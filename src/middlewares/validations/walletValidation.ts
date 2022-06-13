import { body } from 'express-validator';

export const topUp = [
  body('topUp').exists().withMessage('Top-up amount is required (in Naira).'),
];

export const transfer = [
  body('walletId').exists().withMessage("Recepient's wallet ID is required."),
  body('amount')
    .exists()
    .withMessage('Amount to transfer (in Naira) is required.'),
];
