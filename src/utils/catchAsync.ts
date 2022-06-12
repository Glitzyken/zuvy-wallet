import { NextFunction, Response } from 'express';
import { RequestInterface } from './interfaces';

type ExpressFunc = (
  req: RequestInterface,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export default (fn: ExpressFunc) => {
  return (req: RequestInterface, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
