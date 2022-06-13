import { NextFunction, Response, Request } from 'express';

type ExpressFunc = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export default (fn: ExpressFunc) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
