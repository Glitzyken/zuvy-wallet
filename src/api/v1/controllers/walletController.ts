import { Request, Response } from 'express';
// import { RequestInterface } from '../../../utils/interfaces';

class WalletController {
  public async createWallet(req: Request, res: Response) {
    console.log('Creating wallet...');

    res.status(201).json({
      status: 'success',
    });
  }
}

export default WalletController;
