import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import sanitizedConfig from './config';
import recipeRouter from './routes/api/recipes';
import initDB from './database';
import cors from 'cors';
import ingredientRouter from './routes/api/ingredients';
import userRouter from './routes/api/users';
import { User, UserModel } from './models/user';
import { UserManager } from './routes/api/user-controller';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(sanitizedConfig.PORT, () => {
  console.log(`⚡️[server]: Server is running at localhost:${sanitizedConfig.PORT}`);
});

// auth middleware config
const config = {
  issuerBaseURL: sanitizedConfig.AUTH0_DOMAIN,
  audience: sanitizedConfig.AUDIENCE,
};

//initialize database
initDB(sanitizedConfig.URI_MONGODB);

// allow pre-flight cors requests
app.use(cors());

// Initialize the user manager
const userManager = UserManager.getInstance();
userManager.initializeUserMap();




app.use('/api', auth(config), userRouter);

userRouter.use('/u/:email/', recipeRouter);
userRouter.use('/u/:email/', ingredientRouter);
