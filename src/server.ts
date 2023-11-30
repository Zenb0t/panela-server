import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import sanitizedConfig from './config';
import recipeRouter from './recipes/routes';
import initDB from './database';
import ingredientRouter from './ingredients/routes';
import userRouter from './users/routes';
// import { User, UserModel } from './models/user';
import globalMiddleware from './middleware';
import logger from './utils/logger';

const app = express();
app.use(globalMiddleware);

app.listen(sanitizedConfig.PORT, () => {
  logger.info(`⚡️[server]: Server is running at localhost:${sanitizedConfig.PORT}`);
});

//initialize database
initDB(sanitizedConfig.URI_MONGODB);

// app.use('/api', auth(config), userRouter);
app.use('/api', userRouter); // TODO: add auth back in

userRouter.use('/u/', recipeRouter);
// userRouter.use('/u/', ingredientRouter);
