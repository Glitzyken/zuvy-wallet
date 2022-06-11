import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import ApiVersions from './api/index';
import errorHandler from './middlewares/errorHandler';
import AppError from './utils/appError';

dotenv.config();

const app = express();

  app.use(cors());

  app.use(helmet());

  app.set('trust proxy', 1);


    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP. Try again in 15 mins.',
      }),
    );

  // logger middleware
  app.use(morgan('combined'));

  // Add middlewares for parsing JSON and urlencoded data and populating `req.body`
  app.use(express.urlencoded({ extended: false }));

  // parse requests of content-type - application/json
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (_, res) => {
    res.json({ message: 'Welcome to the Zuvy Wallet.' });
  });

  app.use('/api', ApiVersions);

  app.all('*', (req, _, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT).on('listening', () => {
    console.log(`App is in ${process.env.NODE_ENV} mode.`)
    console.log(`💘 app is listening on ${PORT} 🚀`);
  });
