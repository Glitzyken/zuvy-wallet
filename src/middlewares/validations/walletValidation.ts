import { body } from 'express-validator';

export const topUp = [
  body('topUp').exists().withMessage('Top-up amount is required (in Naira).'),
];
