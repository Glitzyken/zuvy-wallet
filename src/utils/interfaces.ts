import { Request } from 'express';

export interface RequestInterface extends Request {
  user?: any;
}

export interface UserInterface {
  id: number;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string | undefined;
  passwordConfirm: string | undefined;
}

export interface WalletInterface {
  id: number;
  uid: string;
  userId: string;
  walletId: string;
  balance: number;
}

export interface FundWallet {
  topUp?: number;
  walletId?: string;
  amount?: number;
}
