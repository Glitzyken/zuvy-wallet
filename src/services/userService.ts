import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const verifyToken = (token: string, secret: string): Promise<any> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      if (typeof decoded === 'object') {
        resolve(decoded);
      }
    });
  });

export const createSendToken = (
  user: any,
  statusCode: number,
  req: Request,
  res: Response,
) => {
  const token = signToken(user.uid);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
