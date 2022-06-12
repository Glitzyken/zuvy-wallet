import { Request } from 'express';
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
