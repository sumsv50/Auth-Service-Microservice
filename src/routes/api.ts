import { Router } from 'express';

import fbRouter from './facebook/auth.router';
import siteRouter from './site/auth.router'
import userRouter from './site/user.router';


// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/facebook', fbRouter);
baseRouter.use('/users', userRouter);
baseRouter.use('/', siteRouter);

// Export default.
export default baseRouter;
