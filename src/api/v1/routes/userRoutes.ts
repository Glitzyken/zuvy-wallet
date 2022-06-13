import express from 'express';

import UserController from '../controllers/userController';
import catchAsync from '../../../utils/catchAsync';

import * as userValidations from '../../../middlewares/validations/userValidation';
import validationResults from '../../../middlewares/validations/validationResults';

const router = express.Router();

const controller = new UserController();

router
  .route('/signup')
  .post(
    userValidations.mainFields,
    userValidations.passwordFields,
    validationResults,
    catchAsync(userValidations.ifAlreadyExists),
    catchAsync(userValidations.passwordMiddleware),
    catchAsync(controller.signup),
  );

export default router;
