import { Request, Response } from "express";

class WalletController {
    public async createWallet(req: Request, res: Response) {
        console.log('Creating wallet...')

        res.status(201).json({
        status: 'success',
        });
    }
}

export default WalletController;