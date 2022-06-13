import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import AppError from '../../utils/appError';

export default (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages: any = [];
    errors.array().forEach((el) => {
      messages.push(el.msg);
    });

    next(new AppError(`${messages.join(' ')}`, 400));
    return;
  }

  next();
};
