import express from 'express';

import UserController from '../controllers/userController';
import catchAsync from '../../../utils/catchAsync';

const router = express.Router();

const controller = new UserController();

router.route('/signup').post(catchAsync(controller.signup));

export default router;
