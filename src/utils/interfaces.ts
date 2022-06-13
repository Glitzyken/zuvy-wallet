import { Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const User = prisma.user;

export interface RequestInterface extends Request {
  user: UserInterface;
}

export interface UserInterface {
  id: number;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string | undefined;
  passwordConfirm: string | undefined;
  walletId: string;
}
