import express from 'express';

import UserController from '../controllers/userController';
import catchAsync from '../../../utils/catchAsync';
import * as userValidations from '../../../middlewares/validations/userValidation';
import validationResults from '../../../middlewares/validations/validationResults';
import getMe from '../../../middlewares/getMe';
import protect from '../../../middlewares/protect';

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
router
  .route('/login')
  .post(
    userValidations.loginCheck,
    validationResults,
    catchAsync(controller.login),
  );
router.route('/logout').get(catchAsync(controller.logout));

router.use(catchAsync(protect));

router.get('/me', getMe, catchAsync(controller.getOneUser));

// Typical Admin routes
router.route('/').get(controller.getAllUsers);

export default router;
