import { NextFunction, Response } from 'express';
import { RequestInterface } from '../utils/interfaces';

export default (req: RequestInterface, res: Response, next: NextFunction) => {
  req.params.uid = req.user.uid;
  next();
};
