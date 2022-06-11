import { Request, Response } from 'express';
import AppError from '../utils/appError';

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.log(
      '🔥🔥🔥🔥🔥______________LOGGING ERROR_______________________🔥🔥🔥🔥🔥🔥',
      { err },
    );

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong.',
    });
  }
};

export default (err: AppError, req: Request, res: Response) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};